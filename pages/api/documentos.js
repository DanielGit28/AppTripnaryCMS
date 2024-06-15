import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.idLugar) {
      await getDocumentoByLugarHandler(req, res);
    } else if (req.query.idPlanViaje) {
      await getDocumentoByPlanViajeHandler(req, res);
    } else if (req.query.reference) {
      await getDocumentoByReferenceHandler(req, res);
    } else {
      await getDocumentosHandler(res);
    }
  } else if (req.method === "POST") {
    await createDocumentHandler(req, res);
  } else if (req.method === "PUT") {
    await updateDocumentoHandler(req, res);
  }
}
const getDocumentosHandler = async (res) => {
  try {
    const documentosSnap = await db.collection("documentos").get();
    const docuementos = documentosSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(docuementos);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getDocumentoByReferenceHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const documentoSnapshot = await db
      .collection("documentos")
      .doc(reference)
      .get();
    const documento = await documentoSnapshot.data();

    res.status(200).json(documento);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getDocumentoByLugarHandler = async (req, res) => {
  try {
    const documentoSnapshot = await db
      .collection("documentos")
      .where("idLugar", "==", req.query.idLugar)
      .get();
    const documento = documentoSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(documento);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getDocumentoByPlanViajeHandler = async (req, res) => {
  try {
    const documentoSnapshot = await db
      .collection("documentos")
      .where("idPlanViaje", "==", req.query.idPlanViaje)
      .get();
    const documento = documentoSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(documento);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createDocumentHandler = async (req, res) => {
  const { nombre, idLugar, estado, idLugarPlan, idPlanViaje, url } = req.body;

  try {
    const newDocumento = {
      nombre: nombre,
      idLugar: idLugar,
      estado: estado,
      idLugarPlan: idLugarPlan,
      idPlanViaje: idPlanViaje,
      url: url,
    };
    const ref = await db.collection("documentos").add(newDocumento);

    const documento = {
      ...newDocumento,
      reference: ref.id,
    };
    res.status(200).end(JSON.stringify(documento));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateDocumentoHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const documentosSnapshot = await db.collection("documentos").doc(reference);
    const documento = await documentosSnapshot.get();
    if (!documento.exists) {
      res.status(404).json({ error: "Documento not found" });
    } else {
      const updatedDocument = {
        reference: reference,
        estado: data.estado || documento.data().estado,
        idLugar: data.idLugar || documento.data().idLugar,
        idLugarPlan: data.idLugarPlan || documento.data().idLugarPlan,
        idPlanViaje: data.idPlanViaje || documento.data().idPlanViaje,
        nombre: data.nombre || documento.data().nombre,
        url: data.url || documento.data().url,
      };

      await documentosSnapshot.update(updatedDocument);
      res.status(200).json(updatedDocument);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};
