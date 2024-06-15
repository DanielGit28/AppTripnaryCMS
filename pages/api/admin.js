import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    getAdminsHandler(res);
  } else if (req.method === "POST") {
    createAdminHandler(req, res);
  }
}

const getAdminsHandler = async (res) => {
  try {
    const usuariosSnapshot = await db
      .collection("usuarios")
      .where("roles", "array-contains", "Administrador")
      .get();
    const admins = usuariosSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createAdminHandler = async (req, res) => {
  const {
    nombre,
    correoElectronico,
    estado,
    fechaNacimiento,
    fotoPerfil,
    idInteresesGenerales,
    latitudDireccion,
    longitudDireccion,
    telefono,
    contrasennia,
  } = req.body;

  try {
    const newAdmin = {
      nombre: nombre,
      correoElectronico: correoElectronico,
      estado: estado,
      fechaNacimiento: fechaNacimiento,
      fotoPerfil: fotoPerfil,
      idInteresesGenerales: idInteresesGenerales,
      latitudDireccion: latitudDireccion,
      longitudDireccion: longitudDireccion,
      telefono: telefono,
      roles: ["Administrador"],
      contrasennia: contrasennia,
    };

    newAdmin.fotoPerfil = await getDocumentoByImagenHandler();

    const ref = await db.collection("usuarios").add(newAdmin);

    const admin = {
      ...newAdmin,
      id: ref.id,
    };
    res.status(200).end(JSON.stringify(admin));
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
