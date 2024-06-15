import { db } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        if(req.query.idPlanViaje){
            await getDiasPlanesViajesByIdPlanViaje(req, res);
        }else{
            await getDiasPlanesViajesHandler(res);
        }
    }

}

const getDiasPlanesViajesHandler = async (res) => {
    try {
        const planesSnap = await db
            .collection("dias_planes_viajes")
            .get();
        const planes = planesSnap.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(planes);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getDiasPlanesViajesByIdPlanViaje = async (req, res) => {
    try {
        const diasSnap = await db.collection("dias_planes_viajes").where("idPlanViaje", "==", req.query.idPlanViaje).get();

        const dias = diasSnap.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(dias);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

