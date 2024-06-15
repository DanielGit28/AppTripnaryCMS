import { db } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {


    } else if (req.method === "POST") {
        await createLugarHandler(req, res);
    }
}

const createLugarHandler = async (req, res) => {
    const {
        nombre: nombre,
        estado: estado,
        direccion: direccion,
        longitud: longitud,
        latitud: latitud,
        imagen: imagen,
        idCiudad: idCiudad,
        url: url,
    } = req.body;

    try {
        const newLugar = {
            nombre: nombre,
            estado: estado,
            direccion: direccion,
            longitud: longitud,
            latitud: latitud,
            imagen: imagen,
            idCiudad: idCiudad,
            url: url,
        };

        newLugar.imagen = await getDocumentoByImagenHandler();

        const ref = await db.collection("lugares_propios").add(newLugar);


        const lugar = {
            ...newLugar,
            reference: ref.id,
        };
        res.status(200).json(lugar);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    }
};

const getDocumentoByImagenHandler = async () => {

    let num = Math.floor(Math.random() * 5) + 6;

    try {
      const documentoSnapshot = await db
        .collection("documentos")
        .where("nombre", "==", "Lugar-" + num.toString())
        .get();
      const documento = documentoSnapshot.docs.map((doc) => ({
        reference: doc.id,
        ...doc.data(),
      }));
      
      return documento[0].url;
    } catch (e) {
      console.error(e);
      
    }
  };
  