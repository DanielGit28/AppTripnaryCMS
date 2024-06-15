import { get } from "react-hook-form";
import { db } from "../../lib/firebase";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.reference) {
      await getCiudadHandler(req, res);
    } else if (req.query.codigoCiudad) {
      await getCiudadByCodigoHandler(req, res);
    }else if (req.query.idPais) {
      await getCiudadByPaisHandler(req, res);
    }else if(req.query.ciudadPais){
      await getCiudadesPaisHandler(req, res)
    } else {
      await getCiudadesHandler(req, res);
    }
  } else if (req.method === "POST") {
    await addCiudadesHandler(req, res);
  } else if (req.method === "PUT") {
    await updateCiudadesHandler(req, res);
  } else if (req.method === "DELETE") {
    if (req.query.reference) {
      await deleteCiudadByReferenceHandler(req, res);
    } else if (req.query.codigoCiudad) {
      await deleteCiudadByCodigoCiudadHandler(req, res);
    }
  }
}

const getCiudadesHandler = async (req, res) => {
  try {
    const ciudadesSnap = await db
      .collection("ciudades").get();

    const ciudades = ciudadesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(ciudades);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getCiudadHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const ciudadSnapshot = await db.collection("ciudades").doc(reference).get();
    const ciudad = await ciudadSnapshot.data();

    res.status(200).json(ciudad);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getCiudadesPaisHandler = async (req, res) => {
  try {

    console.log("test")
    const ciudadesSnap = await db.collection("ciudades").get();

    const ciudades = ciudadesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));


    const paisesSnap = await db.collection("paises").get();

    const paises = paisesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    ciudades.forEach(ciudad => {
      paises.forEach(pais => {
        if(ciudad.idPais === pais.codigoPais){
          console.log(ciudad.idPais, pais.codigoPais)
          ciudad.nombrePais = pais.nombre;
          ciudad.referencePais = pais.reference;
        }
      });
    });

    res.status(200).json(ciudades);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const addCiudadesHandler = async (req, res) => {
  try {
    const ciudad = {
      codigoCiudad: req.body.codigoCiudad,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      idPais: req.body.idPais,
      imagen: req.body.imagen,
      latitud: req.body.latitud,
      longitud: req.body.longitud,
      nombre: req.body.nombre,
    }

    const imagen = await uploadImage(ciudad.imagen, req.body.originalFileName)

    ciudad.imagen = imagen;

    await db.collection("ciudades").add(ciudad)

    res.status(200).json({ message: "Ciudad agregado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

const updateCiudadesHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const ciudadSnapshot = db.collection("ciudades").doc(reference);
    const ciudad = await ciudadSnapshot.get();

    if (!ciudad.exists) {
      res.status(404).json({ error: "País not found" });
    } else {
      const updatedCiudad = {
        reference: reference,
        codigoCiudad: data.codigoCiudad || ciudad.data().codigoCiudad,
        descripcion: data.descripcion || ciudad.data().descripcion,
        estado: data.estado || ciudad.data().estado,
        idPais: data.idPais || ciudad.data().idPais,
        latitud: data.latitud || ciudad.data().latitud,
        longitud: data.longitud || ciudad.data().longitud,
        nombre: data.nombre || ciudad.data().nombre,
      };

      if (ciudad.data().imagen !== data.imagen && data.imagen) {
        const imagen = await uploadImage(data.imagen, req.body.originalFileName)
        updatedCiudad.imagen = imagen;
      } else {
        updatedCiudad.imagen = ciudad.data().imagen;
      }

      await ciudadSnapshot.update(updatedCiudad);
      res.status(200).json(updatedCiudad);
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", error });
  }
}

const deleteCiudadByReferenceHandler = async (req, res) => {
  try {
    await db.collection('ciudades').doc(req.query.reference).delete();

    res.status(200).json({ message: "Ciudad eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", error });
  }
}

const deleteCiudadByCodigoCiudadHandler = async (req, res) => {
  try {
    const ciudad = {
      codigoCiudad: req.body.codigoCiudad,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      idPais: req.body.idPais,
      imagen: req.body.imagen,
      latitud: req.body.latitud,
      longitud: req.body.longitud,
      nombre: req.body.nombre,
    }

    const snapshot = await db.collection("ciudades").where("codigoCiudad", "==", ciudad.codigoCiudad).limit(1).get();
    const documentId = snapshot.docs[0].id;

    await db.collection('ciudades').doc(documentId).delete(ciudad);

    res.status(200).json({ message: "Ciudad eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", error });
  }
}

const uploadImage = async (image, originalFileName) => {
  try {
    const storage = getStorage();
    const filename = generateUniqueFilename(originalFileName);
    const storageRef = ref(storage, `gs://tripnary-8c3d9.appspot.com/ciudades/${filename}`);

    const snapshot = await uploadString(storageRef, image, 'data_url', { contentType: "image/jpg" });
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    return null;
  }
};

const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const extension = originalFilename.split(".").pop();
  return `${timestamp}.${extension}`;
};

const getCiudadByCodigoHandler = async (req, res) => {
  try {
    const ciudadSnapshot = await db
      .collection("ciudades")
      .where("codigoCiudad", "==", req.query.codigoCiudad)
      .get();
    const ciudad = ciudadSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(ciudad);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getCiudadByPaisHandler = async (req, res) => {
  try {
    const ciudadSnapshot = await db
      .collection("ciudades")
      .where("idPais", "==", req.query.idPais)
      .get();
    const ciudad = ciudadSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(ciudad);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};