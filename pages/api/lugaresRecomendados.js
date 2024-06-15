import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getLugaresRecomendadosByIntereses(req, res);
    } else {
      await getLugaresByPopularidad(req, res);
    }
  } else if (req.method === "POST") {
    //   await createLugarHandler(req, res);
  } else if (req.method === "PUT") {
    //   await updateLugarHandler(req, res);
  } else if (req.method === "DELETE") {
    //   await deleteLugarByReferenceHandler(req, res);
  }
}

const getLugaresRecomendadosByIntereses = async (req, res) => {
  try {
    const id = req.query.reference;
    const interesesGeneralesSnapshot = await db
      .collection("intereses_generales")
      .doc(id)
      .get();
    const interesesGenerales = {
      reference: interesesGeneralesSnapshot.id,
      ...interesesGeneralesSnapshot.data(),
    };

    const categoriaViaje = interesesGenerales.categoriaViaje;

    const lugaresRecomendadosSnapshot = await db
      .collection("lugares_recomendados")
      .where("categoriaViaje", "==", categoriaViaje)
      .get();
    const lugaresRecomendados = lugaresRecomendadosSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(lugaresRecomendados);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getLugaresByPopularidad = async (req, res) => {
  try {
    const result = new Array();
    const lugaresPopularesSnapshot = await db
      .collection("lugares_recomendados")
      .get();
    const lugaresPopulares = lugaresPopularesSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    lugaresPopulares.forEach((lugar) => {
      if (parseFloat(lugar.puntuacion) >= 8) {
        result.push(lugar);
      }
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
