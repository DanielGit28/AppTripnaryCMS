// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../lib/firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import signUp from "../../lib/createUserAuth";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      if (req.query.correoElectronico) {
        await getUserByEmailHandler(req, res);
      } else if (req.query.reference) {
        await getUserByReferenceHandler(req, res);
      } else {
        await getUsersHandler(req, res);
      }
    } else if (req.method === "POST") {
      await createUserHandler(req, res);
    } else if (req.method === "PUT") {
      await updateUserHandler(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

const getUserByReferenceHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const usuarioSnapshot = await db
      .collection("usuarios")
      .doc(reference)
      .get();
    const usuario = await usuarioSnapshot.data();

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUsersHandler = async (req, res) => {
  try {
    const usuariosSnapshot = await db
      .collection("usuarios")
      .where("roles", "array-contains", "Usuario")
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

const getUserByEmailHandler = async (req, res) => {
  try {
    const usuarioSnapshot = await db
      .collection("usuarios")
      .where("correoElectronico", "==", req.query.correoElectronico)
      .get();
    const usuario = usuarioSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const { reference, ...data } = req.body;
    const usuarioSnapshot = db.collection("usuarios").doc(reference);
    const usuario = await usuarioSnapshot.get();
    if (!usuario.exists) {
      res.status(404).json({ error: "User not found" });
    } else {
      const updatedUser = {
        reference: reference,
        contrasennia: data.contrasennia || usuario.data().contrasennia,
        correoElectronico:
          data.correoElectronico || usuario.data().correoElectronico,
        estado: data.estado || usuario.data().estado,
        fechaNacimiento: data.fechaNacimiento || usuario.data().fechaNacimiento,
        fotoPerfil: data.fotoPerfil || usuario.data().fotoPerfil,
        idInteresesGenerales:
          data.idInteresesGenerales || usuario.data().idInteresesGenerales,
        latitudDireccion:
          data.latitudDireccion || usuario.data().latitudDireccion,
        longitudDireccion:
          data.longitudDireccion || usuario.data().longitudDireccion,
        nombre: data.nombre || usuario.data().nombre,
        roles: data.roles || usuario.data().roles,
        telefono: data.telefono || usuario.data().telefono,
      };

      if (usuario.data().fotoPerfil !== data.fotoPerfil && data.fotoPerfil) {
        const fotoPerfil = await uploadImage(
          data.fotoPerfil,
          req.body.originalFileName
        );
        updatedUser.fotoPerfil = fotoPerfil;
      } else {
        updatedUser.fotoPerfil = usuario.data().fotoPerfil;
      }

      await usuarioSnapshot.update(updatedUser);

      const { result, error } = await signUp(
        updatedUser.correoElectronico,
        updatedUser.contrasennia
      );

      res.status(200).json(updatedUser);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const uploadImage = async (image, originalFileName) => {
  try {
    const storage = getStorage();
    const filename = generateUniqueFilename(originalFileName);
    const storageRef = ref(
      storage,
      `gs://tripnary-8c3d9.appspot.com/usuarios/${filename}`
    );

    const snapshot = await uploadString(storageRef, image, "data_url", {
      contentType: "image/jpg",
    });
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


const createUserHandler = async (req, res) => {
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
    const newUser= {
      nombre: nombre,
      correoElectronico: correoElectronico,
      estado: estado,
      fechaNacimiento: fechaNacimiento,
      fotoPerfil: fotoPerfil,
      idInteresesGenerales: idInteresesGenerales,
      latitudDireccion: latitudDireccion,
      longitudDireccion: longitudDireccion,
      telefono: telefono,
      roles: ["Usuario"],
      contrasennia: contrasennia,
    };

    newUser.fotoPerfil = await getDocumentoByImagenHandler();

    const ref = await db.collection("usuarios").add(newUser);

    const user = {
      ...newUser,
      reference: ref.id,
    };
    res.status(200).json(user);
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
