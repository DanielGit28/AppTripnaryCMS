import { db } from "../../lib/firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getLugarByReferenceHandler(req, res);
    } else {
      await getLugaresHandler(res);
    }
  } else if (req.method === "POST") {
    await createLugarHandler(req, res);
  } else if (req.method === "PUT") {
    await updateLugarHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteLugarByReferenceHandler(req, res);
  }
}

const getLugaresHandler = async (res) => {
  try {
    const lugaresSnap = await db.collection("lugares_recomendados").get();
    const lugares = lugaresSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(lugares);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createLugarHandler = async (req, res) => {
  const {
    nombre: nombre,
    estado: estado,
    puntuacion: puntuacion,
    longitud: longitud,
    latitud: latitud,
    imagen: imagen,
    idCiudad: idCiudad,
    horaInicial: horaInicial,
    horaFinal: horaFinal,
    descripcion: descripcion,
    codigoPostal: codigoPostal,
    categoriaViaje: categoriaViaje,
    temporada: temporada,
    url: url,
    imagenCover: imagenCover,
  } = req.body;

  try {
    const newAdmin = {
      nombre: nombre,
      estado: estado,
      puntuacion: puntuacion,
      longitud: longitud,
      latitud: latitud,
      imagen: imagen,
      idCiudad: idCiudad,
      horaInicial: horaInicial,
      horaFinal: horaFinal,
      descripcion: descripcion,
      codigoPostal: codigoPostal,
      categoriaViaje: categoriaViaje,
      temporada: temporada,
      url: url,
      imagenCover: imagenCover,
    };

    const ref = await db.collection("lugares_recomendados").add(newAdmin);

    const admin = {
      ...newAdmin,
      reference: ref.id,
    };
    res.status(200).end(JSON.stringify(admin));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: mes });
  }
};

const getLugarByReferenceHandler = async (req, res) => {
  try {
    const lugarSnapshot = await db
      .collection("lugares_recomendados")
      .doc(req.query.reference)
      .get();

    if (!lugarSnapshot.exists) {
      res.status(404).json({ error: "Lugar not found" });
      return;
    }

    const lugar = lugarSnapshot.data();
    lugar.reference = lugarSnapshot.id;
    res.status(200).json(lugar);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateLugarHandler = async (req, res) => {
  try {
    const {
      reference,
      nombre,
      estado,
      puntuacion,
      longitud,
      latitud,
      imagen,
      idCiudad,
      horaInicial,
      horaFinal,
      descripcion,
      codigoPostal,
      categoriaViaje,
      temporada,
      url,
      imagenCover,
    } = req.body;

    const lugarSnapshot = db.collection("lugares_recomendados").doc(reference);
    const lugar = await lugarSnapshot.get();

    if (!lugar.exists) {
      res.status(404).json({ error: "Lugar not found" });
    } else {
      const updatedLugar = {
        reference: reference,
        nombre: nombre || lugar.data().nombre,
        estado: estado || lugar.data().estado,
        puntuacion: puntuacion || lugar.data().puntuacion,
        longitud: longitud || lugar.data().longitud,
        latitud: latitud || lugar.data().latitud,
        imagen: imagen || lugar.data().imagen,
        idCiudad: idCiudad || lugar.data().idCiudad,
        horaInicial: horaInicial || lugar.data().horaInicial,
        horaFinal: horaFinal || lugar.data().horaFinal,
        descripcion: descripcion || lugar.data().descripcion,
        codigoPostal: codigoPostal || lugar.data().codigoPostal,
        categoriaViaje: categoriaViaje || lugar.data().categoriaViaje,
        temporada: temporada || lugar.data().temporada,
        url: url || lugar.data().url,
        imagenCover: imagenCover || lugar.data().imagenCover,
      };

      await lugarSnapshot.update(updatedLugar);
      res.status(200).json(updatedLugar);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteLugarByReferenceHandler = async (req, res) => {
  try {
    await db
      .collection("lugares_recomendados")
      .doc(req.query.reference)
      .delete();

    res.status(200).json({ message: "Lugar eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", error });
  }
};
