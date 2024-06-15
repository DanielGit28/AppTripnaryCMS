import { sendEmailInvitacion } from "../../lib/sendgrid";
import { db } from "../../lib/firebase";
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      if (req.query.reference) {
        await getColaboradoresByReferenceHandler(req, res);
      } else if (req.query.idPlanViaje) {
        await getColaboradoresByViajeHandler(req, res);
      }
    } else if (req.method === "POST") {
      await sendCorreoColaborador(req, res);
    } else if (req.method === "PUT") {
      await updateColaboradorHandler(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

const sendCorreoColaborador = async (req, res) => {
  const { correoElectronico, nombre, idPlanViaje, rol } = req.body;
  try {
    const newColaborador = {
      correoElectronico: correoElectronico,
      estado: "Activo",
      idPlanViaje: idPlanViaje,
      idUsuarioColaborador: "",
      nombre: nombre,
      rol: rol,
    };
    const usuarioSnapshot = await db
      .collection("usuarios")
      .where("correoElectronico", "==", correoElectronico)
      .get();
    const usuario = usuarioSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    if (usuario.length > 0) {
      newColaborador.idUsuarioColaborador = usuario[0].reference;
    }
    const refColaborador = await db
      .collection("colaboradores_viajes")
      .add(newColaborador);
    const colaborador = {
      reference: refColaborador.id,
      ...newColaborador,
    };
    res.status(200).end(JSON.stringify(colaborador));
    await sendEmailInvitacion(correoElectronico, nombre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getColaboradoresByViajeHandler = async (req, res) => {
  const colaboradoresSnapshot = await db
    .collection("colaboradores_viajes")
    .where("idPlanViaje", "==", req.query.idPlanViaje)
    .get();
  const usuario = colaboradoresSnapshot.docs.map((doc) => ({
    reference: doc.id,
    ...doc.data(),
  }));
  res.status(200).json(usuario);
};

const getColaboradoresByReferenceHandler = async (req, res) => {
  try {
    const reference = req.query.reference;
    const colaboradorSnapshot = await db
      .collection("colaboradores_viajes")
      .doc(reference)
      .get();
    const colaborador = await colaboradorSnapshot.data();
    colaborador.reference = colaboradorSnapshot.id;
    res.status(200).json(colaborador);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateColaboradorHandler = async (req, res) => {
  try {
    const {
      reference,
      correoElectronico,
      estado,
      idPlanViaje,
      idUsuarioColaborador,
      nombre,
      rol,
    } = req.body;
    const colaboradorSnapshot = db
      .collection("colaboradores_viajes")
      .doc(reference);
    const colaborador = await colaboradorSnapshot.get();

    if (colaborador.exists) {
      const updatedColaborador = {
        reference: reference,
        correoElectronico:
          correoElectronico || colaborador.data().correoElectronico,
        estado: estado || colaborador.data().estado,
        idPlanViaje: idPlanViaje || colaborador.data().idPlanViaje,
        idUsuarioColaborador:
          idUsuarioColaborador || colaborador.data().idUsuarioColaborador,
        nombre: nombre || colaborador.data().nombre,
        rol: rol || colaborador.data().rol,
      };
      await colaboradorSnapshot.update(updatedColaborador);
      res.status(200).json(updatedColaborador);
    } else {
      res.status(404).json({ message: "Colaborador not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
