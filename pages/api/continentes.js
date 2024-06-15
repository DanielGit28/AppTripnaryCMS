import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getContinenteByIdHandler(req, res);
    } else if(req.query.codigoContinente){
      await getContinenteByCodigoHandler(req, res);
    }else {
      await getContinentesHandler(res);
    }
  } else if (req.method === "POST") {
    await createContinenteHandler(req, res);
  } else if (req.method === "PUT") {
    await updateContinenteHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteContinenteHandler(req, res);
  }

}

const getContinentesHandler = async (res) => {
  try {
    const continentesSnap = await db
      .collection("continentes")
      .get();
    const continentes = continentesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(continentes);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getContinenteByIdHandler = async (req, res) => {
  try {
    const reference = req.query.reference
    const continenteRef = db.collection('continentes').doc(reference)
    const continente = await continenteRef.get().then((snap) => snap.data())
    res.status(200).json(continente);
  } catch (e) {
    console.error(e);
    res.status(500).end(JSON.stringify("Error al obtener el continente"));
  }
};

const getContinenteByCodigoHandler = async (req, res) => {
  try {
    const codigoContinente = req.query.codigoContinente;
    const snapshot = await db.collection("continentes").where("codigoContinente", "==", codigoContinente).limit(1).get();
    const continente = snapshot.docs[0].data();
    continente.reference = snapshot.docs[0].id;

    res.status(200).json(continente);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteContinenteHandler = async (req, res) => {
  try {
    const { reference } = req.query
    const continenteRef = db.collection('continentes').doc(reference)
    const continente = await continenteRef.get()
    if (!continente.exists) {
      res.status(404).end(JSON.stringify('Continente no encontrado'))
    } else {
      await continenteRef.delete()
      res.status(200).end(JSON.stringify('Continente eliminado correctamente'));
    }
  } catch (e) {
    res.status(500).end(JSON.stringify('Error eliminando el continente'))
  }
}


const createContinenteHandler = async (req, res) => {
  const {
    nombre,
    descripcion,
    estado,
    codigoContinente
  } = req.body;

  try {
    const newContinente = {
      nombre: nombre,
      descripcion: descripcion,
      estado: estado,
      codigoContinente: codigoContinente
    };
    const ref = await db.collection('continentes').where("codigoContinente", "==", codigoContinente).get()
      .then(async function (querySnapshot) {
        if (!querySnapshot.empty) {
          throw new Error('Continente ya existe');
        }
        else {
          return await db.collection('continentes').add(newContinente)
        }
      });
    const Continente = {
      ...newContinente,
      id: ref.id
    };
    res.status(200).end(JSON.stringify(Continente));
  } catch (e) {
    console.error('Final error: ', e);
    res.status(500).end(JSON.stringify(e.message));
  }
}

const updateContinenteHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const continenteSnapshot = db.collection("continentes").doc(reference);
    const continente = await continenteSnapshot.get();
    if (!continente.exists) {
      throw new Error('Continente no encontrado');
    } else {
      const continenteActualizado = {
        reference: reference,
        descripcion: data.descripcion || continente.data().descripcion,
        codigoContinente:
          data.codigoContinente || continente.data().codigoContinente,
        estado: data.estado || continente.data().estado,
        nombre: data.nombre || continente.data().nombre,
      };
      await continenteSnapshot.update(continenteActualizado);

      res.status(200).end(JSON.stringify(continenteActualizado));
    }
  } catch (e) {
    console.error(e);
    res.status(500).end(JSON.stringify(e.message));
  }
};


