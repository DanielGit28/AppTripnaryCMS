import { db } from "../../lib/firebase";
import { createInteresesLugaresHandler } from "./interesesLugares";
import { createInteresesRestaurantesHandler } from "./interesesRestaurantes";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getPromptByIdHandler(req, res);
    } else if (req.query.nombre) {
      await getPromptByNombre(req, res);
    } else {
      await getPromptsHandler(res);
    }
  } else if (req.method === "POST") {
    await createPromptHandler(req, res);
  } else if (req.method === "PUT") {
    await updatePromptHandler(req, res);
  } else if (req.method === "DELETE") {
    await deletePromptHandler(req, res);
  }

}

const getPromptsHandler = async (res) => {
  try {
    const promptsSnap = await db
      .collection("prompts")
      .get();
    const prompts = promptsSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getPromptByIdHandler = async (req, res) => {
  try {
    const reference = req.query.reference
    const PromptRef = db.collection('prompts').doc(reference)
    const Prompt = await PromptRef.get().then((snap) => snap.data())
    res.status(200).json(Prompt);
  } catch (e) {
    res.status(500).end(JSON.stringify("Error al obtener el Prompt"));
  }
};

const getPromptByNombre = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const snapshot = await db.collection("prompts").where("nombre", "==", nombre).limit(1).get();
    const Prompt = snapshot.docs[0].data();
    Prompt.reference = snapshot.docs[0].id;

    res.status(200).json(Prompt);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deletePromptHandler = async (req, res) => {
  try {
    const { reference } = req.query
    const PromptRef = db.collection('prompts').doc(reference)
    const Prompt = await PromptRef.get()
    if (!Prompt.exists) {
      res.status(404).end(JSON.stringify('Prompt no encontrado'))
    } else {
      await PromptRef.delete()
      res.status(200).end(JSON.stringify('Prompt eliminado correctamente'));
    }
  } catch (e) {
    res.status(500).end(JSON.stringify('Error eliminando el Prompt'))
  }
}


const createPromptHandler = async (req, res) => {
  const {
    cantidadDias,
    tipoComida,
    lugarPreferido,
    estado,
    nombreCiudad,
    presupuesto
  } = req.body;
  const referencePlanViaje = req.query.referencePlanViaje
  //Lugares o restaurantes
  const tipoPrompt = req.query.tipo
  try {
    const promptLugares = `Return the JSON only and in spanish. Recommendations in ${lugarPreferido} in ${nombreCiudad} for ${cantidadDias} days. From 3 to 5 recommendations per day. Create a valid JSON array that has the address, hours, name, and price properties. Each property has to be enclosed in double quotes. Follow the following format: [ [{'nombre': String, 'direccion': String, 'horario': String, 'precio': String}] ]`

    const promptRestaurantes = `Return the JSON only and in spanish. Recommendations of ${tipoComida} food in ${nombreCiudad} for ${cantidadDias} days. From 3 to 5 recommendations per day. Create a valid JSON array that has the address, hours, name, food and rating properties. Each property has to be enclosed in double quotes. Follow the following format: [ [{'nombre': String, 'direccion': String, 'horario': String, 'rating': String, 'comida': String}] ]`

    const baseDescripcion = tipoPrompt.toLocaleLowerCase() === "lugares" ? promptLugares : promptRestaurantes

    const nombre = `Prompt para ${lugarPreferido} en ${nombreCiudad}`
    const newPrompt = {
      nombre: nombre,
      descripcion: baseDescripcion,
      estado: estado,
      tipo: tipoPrompt
    };
    const ref = await db.collection('prompts').add(newPrompt)
    const Prompt = {
      ...newPrompt,
      id: ref.id
    };

    const interesBody = req.body
    interesBody.idPrompts = Prompt.id
    const refIntereses = tipoPrompt === "lugares" ? await createInteresesLugaresHandler(interesBody) : await createInteresesRestaurantesHandler(interesBody)


    // const openai = new OpenAIApi(configuration);
    // const responseAI = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ "role": "user", "content": baseDescripcion }]
    // });
    //const contentAI = responseAI.data.choices[0].message.content
    let contentAI = ""
    const aiPrompt = {
      model: "gpt-3.5-turbo",
      //prompt: prompt.descripcion,
      messages: [{ "role": "user", "content": baseDescripcion }]
    };
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiPrompt)
      });
      const data = await response.json();
      if (!response.ok) {
        //throw new Error(data);
        contentAI = "Hubo un error con la AI"
      } else {
        contentAI = data.choices[0].message.content
      }
    } catch (error) {
      contentAI = "Hubo un error con la AI"
    }
    

    //Actualizar el plan de viaje con el id del interes lugar del usuario
    const planViajeSnapshot = db
      .collection("planes_viajes")
      .doc(referencePlanViaje)

    const planViajeSnap = await db
      .collection("planes_viajes")
      .doc(referencePlanViaje)
      .get()

    const planViaje = planViajeSnap.data();
    //planViaje.reference = planViaje.id;
    if (tipoPrompt === "lugares") {
      planViaje.idInteresLugar = refIntereses.id
    } else {
      planViaje.idInteresRestaurante = refIntereses.id
    }
    const updatedPlanViaje = await planViajeSnapshot.update(planViaje);

    //Guardar todas las recomendaciones que devuelve openAI segun la cantidad de dias
    if (isJson(contentAI)) {
      await saveIntereses(JSON.parse(contentAI), refIntereses.id, tipoPrompt)
    }

    const response = isJson(contentAI) ? responseAIArrayJson(contentAI) : "Hubo un error con la AI"
    res.status(200).json(response);
  } catch (e) {
    res.status(500).end(e.message);
  }
}

const saveIntereses = async (responseAI, refInteresesId, tipo) => {
  responseAI.forEach((dia) =>
    dia.forEach(async (recomendacion) => {
      if (tipo === "lugares") {
        recomendacion.idInteresLugar = refInteresesId
        recomendacion.estado = "Activo"
        const refLugar = await db.collection('lugares_recomendados_ai').add(recomendacion)
      } else {
        recomendacion.idInteres = refInteresesId
        recomendacion.estado = "Activo"
        const refLugar = await db.collection('restaurantes_recomendados_ai').add(recomendacion)
      }
    })
  )
}

const responseAIArrayJson = (responseAI) => {
  const responseArray = []
  JSON.parse(responseAI).forEach((day, i) => {
    day.forEach((recomendacion) => {
      recomendacion.dia = i + 1
      responseArray.push(recomendacion)
    })
  })
  return JSON.stringify(responseArray)
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const updatePromptHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const promptsnapshot = db.collection("prompts").doc(reference);
    const Prompt = await promptsnapshot.get();
    if (!Prompt.exists) {
      throw new Error('Prompt no encontrado');
    } else {
      const PromptActualizado = {
        reference: reference,
        descripcion: data.descripcion || Prompt.data().descripcion,
        nombre:
          data.nombre || Prompt.data().nombre,
        estado: data.estado || Prompt.data().estado,
        tipo: data.tipo || Prompt.data().tipo,
      };
      await promptsnapshot.update(PromptActualizado);
      res.status(200).end(JSON.stringify(PromptActualizado));
    }
  } catch (e) {
    res.status(500).end(JSON.stringify(e.message));
  }
};


