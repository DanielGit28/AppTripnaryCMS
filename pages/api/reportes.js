import { tr } from "date-fns/locale";
import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.tipo === "Usuarios") {
      await getReportesByUsuarioRegistrado(req, res);
    } else if (req.query.tipo === "Viajes") {
      await getReportesByViaje(req, res);
    } else if (req.query.tipo === "Destinos") {
      await getReportesByCountIdPais(res);
    }
  }
}

const getReportesByUsuarioRegistrado = async (req, res) => {
  try {
    const reportesSnapshot = await db
      .collection("usuarios")
      .where("roles", "array-contains", "Usuario")
      .get();

    const reportes = reportesSnapshot.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(reportes);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getReportesByCountIdPais = async (res) => {
  try {
    const planesSnap = await db.collection("planes_viajes").get();

    const planes = planesSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    const idPaisCountMap = {};
    planes.forEach((plan) => {
      const { idPais } = plan;
      idPaisCountMap[idPais] = (idPaisCountMap[idPais] || 0) + 1;
    });

    const sortedIdPais = Object.keys(idPaisCountMap).sort(
      (a, b) => idPaisCountMap[b] - idPaisCountMap[a]
    );

    const result = sortedIdPais.map((idPais) => ({
      idPais,
      count: idPaisCountMap[idPais],
      planes: planes.filter((plane) => plane.idPais === idPais),
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
