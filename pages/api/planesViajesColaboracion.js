import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.correoColaborador) {
      await getPlanByCorreoColaborador(req, res);
    } else if (req.query.idPlanViaje) {
      await getTipoColaborador(req, res);
    }
  } else if (req.method === "POST") {
  } else if (req.method === "PUT") {
  }
}

const getTipoColaborador = async (req, res) => {
  try {
    const ref = await db
      .collection("colaboradores_viajes")
      .where("idPlanViaje", "==", req.query.idPlanViaje)
      .get();
    const colaborador = ref.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(colaborador);
  } catch (error) {
    console.error("Error fetching plan by colaborador email:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the plan." });
  }
};

const getPlanByCorreoColaborador = async (req, res) => {
  try {
    const planes = [];
    const ref = await db
      .collection("colaboradores_viajes")
      .where("correoElectronico", "==", req.query.correoColaborador)
      .get();

    const idPlanViajes = ref.docs.map((doc) => doc.data().idPlanViaje);

    for (const idPlan of idPlanViajes) {
      const planesSnapshot = await db
        .collection("planes_viajes")
        .doc(idPlan)
        .get();
      planes.push({
        reference: planesSnapshot.id,
        ...planesSnapshot.data(),
      });
    }

    res.status(200).json(planes);
  } catch (error) {
    console.error("Error fetching plan by colaborador email:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the plan." });
  }
};
