import { get } from "react-hook-form";
import { db } from "../../lib/firebase";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if(req.query.reference){
      await getPaisHandler(req, res);
    }else if(req.query.codigoPais){
      await getPaisByCodigoPaisHandler(req, res);
    }else if(req.query.paisContinente){
      await getPaisesContinentesHandler(req, res);
    }else{
      await getPaisesHandler(req, res);
    }
  }else if (req.method === "POST") {
    await addPaisesHandler(req, res);
  }else if (req.method === "PUT") {
    await updatePaisesHandler(req, res);
  }else if (req.method === "DELETE") {
    if(req.query.reference){
      await deletePaisByReferenceHandler(req, res);
    }else if(req.query.codigoPais){
      await deletePaisByCodigoPaisHandler(req, res);
    }
  }
}

const getPaisesHandler = async (req, res) => {
  try {
    const paisesSnap = await db
      .collection("paises").get();

    const paises = paisesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(paises);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getPaisesContinentesHandler = async (req, res) => {
  try {
    const paisesSnap = await db.collection("paises").get();

    const paises = paisesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));


    const continentesSnap = await db.collection("continentes").get();

    const continentes = continentesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    paises.forEach(pais => {
      continentes.forEach(continente => {
        if(pais.idContinente === continente.codigoContinente){
          pais.nombreContinente = continente.nombre;
          pais.idContinente = continente.codigoContinente;
          pais.referenceContinente = continente.reference;
        }
      });
    });

    res.status(200).json(paises);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getPaisHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const paisSnapshot = await db.collection("paises").doc(reference).get();
    const pais = await paisSnapshot.data();

    res.status(200).json(pais);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getPaisByCodigoPaisHandler = async (req, res) => {
  try {
    const codigoPais = req.query.codigoPais;
    const snapshot = await db.collection("paises").where("codigoPais", "==", codigoPais).limit(1).get();
    const pais = snapshot.docs[0].data();
    pais.reference = snapshot.docs[0].id;

    res.status(200).json(pais);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addPaisesHandler = async (req, res) => {
    try{
        const pais = {
            codigoPais: req.body.codigoPais,
            descripcion: req.body.descripcion,
            estado: req.body.estado,
            idContinente: req.body.idContinente,
            imagen: req.body.imagen,
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            nombre: req.body.nombre,
        }

        const imagen = await uploadImage(pais.imagen, req.body.originalFileName)

        pais.imagen = imagen;

        await db.collection("paises").add(pais)

        res.status(200).json({ message: "Pais agregado"});
    }catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

const updatePaisesHandler = async (req, res) => {
    try{
      const { reference, ...data } = req.body;
      const paisSnapshot = db.collection("paises").doc(reference);
      const pais = await paisSnapshot.get();

      if (!pais.exists) {
        res.status(404).json({ error: "País not found" });
      } else {
        const updatedPais = {
          reference: reference,
          codigoPais: data.codigoPais || pais.data().codigoPais,
          descripcion: data.descripcion || pais.data().descripcion,
          estado: data.estado || pais.data().estado,
          idContinente: data.idContinente || pais.data().idContinente,
          latitud: data.latitud || pais.data().latitud,
          longitud: data.longitud || pais.data().longitud,
          nombre: data.nombre || pais.data().nombre,
        };

        if(pais.data().imagen !== data.imagen && data.imagen){
          const imagen = await uploadImage(data.imagen, req.body.originalFileName)
          updatedPais.imagen = imagen;
        }else{
          updatedPais.imagen = pais.data().imagen;
        }

        await paisSnapshot.update(updatedPais);
        res.status(200).json(updatedPais);
      }
    }catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong", error });
    }
}

const deletePaisByReferenceHandler = async (req, res) => {
  try{
      await db.collection('paises').doc(req.query.reference).delete();

      res.status(200).json({ message: "Pais eliminado"});
  }catch (error) {
      res.status(500).json({ error: "Something went wrong", error });
  }
}

const deletePaisByCodigoPaisHandler = async (req, res) => {
    try{
        const pais = {
            codigoPais: req.body.codigoPais,
            descripcion: req.body.descripcion,
            estado: req.body.estado,
            idContinente: req.body.idContinente,
            imagen: req.body.imagen,
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            nombre: req.body.nombre,
        }

        const snapshot = await db.collection("paises").where("codigoPais", "==", pais.codigoPais).limit(1).get();
        const documentId = snapshot.docs[0].id;

        await db.collection('paises').doc(documentId).delete(pais);

        res.status(200).json({ message: "Pais eliminado"});
    }catch (error) {
        res.status(500).json({ error: "Something went wrong", error });
    }
}

const uploadImage = async (image, originalFileName) => {
    try{
      const storage = getStorage();
      const filename = generateUniqueFilename(originalFileName);
      const storageRef = ref(storage, `gs://tripnary-8c3d9.appspot.com/paises/${filename}`);

      const snapshot = await uploadString(storageRef, image, 'data_url', { contentType: "image/jpg" });
      const url = await getDownloadURL(storageRef);

      return url;
    }catch (error) {
      return null;
    }
};

const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const extension = originalFilename.split(".").pop();
  return `${timestamp}.${extension}`;
};