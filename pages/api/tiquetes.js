import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getTiquetHandler(req, res);
    } else if (req.query.correoUsuario) {
      await getTiquetesByCorreoUsuarioHandler(req, res);
    } else {
      await getTiquetesHandler(req, res);
    }
  } else if (req.method === "POST") {
    if (req.query.agregarTiquete) {
      await agregarTiqueteHandler(req, res);
    } else {
      await addTiquetesHandler(req, res);
    }
  } else if (req.method === "PUT") {
    await updateTiquetesHandler(req, res);
  } else if (req.method === "DELETE") {
    await deleteTiquetByReferenceHandler(req, res);
  }
}

const getTiquetesHandler = async (req, res) => {
  try {
    const tiquetesSnap = await db
      .collection("tiquetes").get();

    const tiquetes = tiquetesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(tiquetes);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getTiquetHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const tiquetSnapshot = await db.collection("tiquetes").doc(reference).get();
    const tiquet = await tiquetSnapshot.data();

    res.status(200).json(tiquet);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getTiquetesByCorreoUsuarioHandler = async (req, res) => {
  try {
    const correoUsuario = req.query.correoUsuario;
    const snapshot = await db.collection("tiquetes").where("correoElectronico", "==", correoUsuario).get();

    const tiquetes = snapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(tiquetes);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addTiquetesHandler = async (req, res) => {
  try {
    const tiquet = {
      categoria: req.body.categoria,
      correoElectronico: req.body.correoElectronico,
      estado: req.body.estado,
      idUsuario: req.body.idUsuario,
      mensajeAdmin: req.body.mensajeAdmin,
      mensajeUsuario: req.body.mensajeUsuario,
      nombreCompleto: req.body.nombreCompleto,
    }

    await db.collection("tiquetes").add(tiquet)

    res.status(200).json({ message: "Tiquet agregado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

const agregarTiqueteHandler = async (req, res) => {
  try {
    console.log(req.body)
    console.log("Call")
    const referenceUsuario = req.body.idUsuario;
    console.log("1")
    console.log(referenceUsuario)
    const usuario = (await db.collection("usuarios").doc(referenceUsuario).get()).data();
    console.log("2")
    const tiquet = {
      categoria: req.body.categoria,
      correoElectronico: usuario.correoElectronico,
      estado: req.body.estado,
      idUsuario: req.body.idUsuario,
      mensajeAdmin: req.body.mensajeAdmin,
      mensajeUsuario: req.body.mensajeUsuario,
      nombreCompleto: usuario.nombre,
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    tiquet.fechaDeCreacion = dd + '/' + mm + '/' + yyyy;

    await db.collection("tiquetes").add(tiquet)
console.log("Callsucces")
    res.status(200).json({ message: "Tiquet agregado" });
  } catch (error) {
    console.log("error")
    res.status(500).json({ error: "Something went wrong" });
  }
}

const updateTiquetesHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const tiquetSnapshot = db.collection("tiquetes").doc(reference);
    const tiquet = await tiquetSnapshot.get();

    if (!tiquet.exists) {
      res.status(404).json({ error: "Tiquet not found" });
    } else {
      const updatedTiquet = {
        reference: reference,
        categoria: data.categoria || tiquet.data().categoria,
        correoElectronico: data.correoElectronico || tiquet.data().correoElectronico,
        estado: data.estado || tiquet.data().estado,
        idUsuario: data.idUsuario || tiquet.data().idUsuario,
        mensajeAdmin: data.mensajeAdmin || tiquet.data().mensajeAdmin,
        mensajeUsuario: data.mensajeUsuario || tiquet.data().mensajeUsuario,
        nombreCompleto: data.nombreCompleto || tiquet.data().nombreCompleto,
      };

      await tiquetSnapshot.update(updatedTiquet);
      res.status(200).json(updatedTiquet);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong", error });
  }
}

const deleteTiquetByReferenceHandler = async (req, res) => {
  try {
    await db.collection('tiquetes').doc(req.query.reference).delete();

    res.status(200).json({ message: "Tiquet eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", error });
  }
}