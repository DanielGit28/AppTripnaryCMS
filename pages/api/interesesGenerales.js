import { db } from "../../lib/firebase";
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await createInteresesGenerales(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
const createInteresesGenerales = async (req, res) => {
  const { categoriaViaje, destinoPreferido, estado, temporadaPreferida } =
    req.body;
  try {
    const newInteresesGenerales = {
      categoriaViaje: categoriaViaje,
      destinoPreferido: destinoPreferido,
      estado: estado,
      temporadaPreferida: temporadaPreferida,
    };
    const refInteresesGenerales = await db
      .collection("intereses_generales")
      .add(newInteresesGenerales);

    const interesGeneral = {
      id: refInteresesGenerales.id,
      ...newInteresesGenerales,
    };

    const newInvitado = {
      nombre: "",
      correoElectronico: "",
      estado: "Activo",
      fechaNacimiento: "",
      fotoPerfil: "",
      idInteresesGenerales: interesGeneral.id,
      latitudDireccion: "",
      longitudDireccion: "",
      telefono: "",
      roles: ["Invitado"],
      contrasennia: "",
    };

    newInvitado.fotoPerfil = await getDocumentoByImagenHandler();

    const refInvitado = await db.collection("usuarios").add(newInvitado);

    const usuario = {
      reference: refInvitado.id,
      ...newInvitado,
    };
    res.status(200).end(JSON.stringify(usuario));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const getDocumentoByImagenHandler = async () => {

  let num = Math.floor(Math.random() * 5) + 1;

  try {
      const documentoSnapshot = await db
          .collection("documentos")
          .where("nombre", "==", "Avatar-" + num.toString())
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
