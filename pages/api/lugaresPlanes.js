import { db } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {

        if (req.query.idPlanViajeLugarRecomendado) {
            await getLugaresPlanesByIdLugarRecomendado(req, res);

        } else if (req.query.idPlanViajeLugar) {

            await getLugaresPlanesByPlanLugarPropio(req, res);
        } else if (req.query.idPlanViaje) {

            await getLugaresPlanesByIdPlan(req, res);
        } else {
            await getLugaresPlanesHandler(res);
        }


    } else if (req.method === "POST") {
        await createLugarPlanesHandler(req, res);
    } else if (req.method === "PUT") {
        await updateLugarHandler(req, res);
    } else if (req.method === "DELETE") {
        await deleteLugarByReferenceHandler(req, res);
    }
}


const getLugaresPlanesHandler = async (res) => {
    try {
        const lugaresSnap = await db.collection("lugares_planes").get();
        const lugares = lugaresSnap.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(lugares);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};


const createLugarPlanesHandler = async (req, res) => {
    const {
        completado: completado,
        horaFin: horaFin,
        horaInicio: horaInicio,
        idDia: idDia,
        idLugarPropio: idLugarPropio,
        idLugarRecomendado: idLugarRecomendado,
        idPlanViaje: idPlanViaje,
        notas: notas,
        estado: estado
    } = req.body;

    try {
        const newPlan = {
            completado: completado,
            horaFin: horaFin,
            horaInicio: horaInicio,
            idDia: idDia,
            idLugarPropio: idLugarPropio,
            idLugarRecomendado: idLugarRecomendado,
            idPlanViaje: idPlanViaje,
            notas: notas,
            estado: estado
        };

        const ref = await db.collection("lugares_planes").add(newPlan);

        const lugar = {
            ...newPlan,
            reference: ref.id,
        };
        res.status(200).json(lugar);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getLugaresPlanesByIdLugarRecomendado = async (req, res) => {
    try {
        const lugaresSnapshot = await db
            .collection("lugares_planes")
            .where("idPlanViaje", "==", req.query.idPlanViajeLugarRecomendado)
            .get();
        const lugaresPlanes = lugaresSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        const arrayLugaresRecomendados = []

        for (let i = 0; i < lugaresPlanes.length; i++) {

            if (lugaresPlanes[i].idLugarRecomendado != "null") {

                const lugaresRecomendadosSnapshot = await db
                    .collection("lugares_recomendados")
                    .doc(lugaresPlanes[i].idLugarRecomendado)
                    .get();
                const lugar = {
                    reference: lugaresRecomendadosSnapshot.id,
                    ...lugaresRecomendadosSnapshot.data(),
                };

                arrayLugaresRecomendados.push(lugar);

            }

        }

        res.status(200).json(arrayLugaresRecomendados);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const getLugaresPlanesByPlanLugarPropio = async (req, res) => {
    try {
        const lugaresSnapshot = await db
            .collection("lugares_planes")
            .where("idPlanViaje", "==", req.query.idPlanViajeLugar)
            .get();
        const lugaresPlanes = lugaresSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        const arrayLugaresRecomendados = []

        for (let i = 0; i < lugaresPlanes.length; i++) {

            if (lugaresPlanes[i].idLugarPropio != "null") {

                const lugaresPropiosSnapshot = await db
                    .collection("lugares_propios")
                    .doc(lugaresPlanes[i].idLugarPropio)
                    .get();
                const lugar = {
                    reference: lugaresPropiosSnapshot.id,
                    ...lugaresPropiosSnapshot.data(),
                };

                arrayLugaresRecomendados.push(lugar);

            }

        }

        res.status(200).json(arrayLugaresRecomendados);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getLugaresPlanesByIdPlan = async (req, res) => {
    try {
        const lugaresSnapshot = await db
            .collection("lugares_planes")
            .where("idPlanViaje", "==", req.query.idPlanViaje)
            .get();
        const lugaresPlanes = lugaresSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(lugaresPlanes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const updateLugarHandler = async (req, res) => {
    try {
        const {
            reference,
            completado: completado,
            horaFin: horaFin,
            horaInicio: horaInicio,
            idDia: idDia,
            idLugarPropio: idLugarPropio,
            idLugarRecomendado: idLugarRecomendado,
            idPlanViaje: idPlanViaje,
            notas: notas,
            estado: estado
        } = req.body;

        const lugarSnapshot = db.collection("lugares_planes").doc(reference);
        const lugar = await lugarSnapshot.get();

        if (!lugar.exists) {
            res.status(404).json({ error: "Lugar not found" });
        } else {
            const updatedLugar = {
                reference: reference,
                estado: estado || lugar.data().estado,
                horaFin: horaFin || lugar.data().horaFin,
                horaInicio: horaInicio || lugar.data().horaInicio,
                idDia: idDia || lugar.data().idDia,
                idLugarPropio: idLugarPropio || lugar.data().idLugarPropio,
                ididLugarRecomendadoCiudad: idLugarRecomendado || lugar.data().idLugarRecomendado,
                idPlanViaje: idPlanViaje || lugar.data().idPlanViaje,
                notas: notas || lugar.data().notas,
                completado: completado || lugar.data().completado
            };

            await lugarSnapshot.update(updatedLugar);
            res.status(200).json(updatedLugar);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const deleteLugarByReferenceHandler = async (req, res) => {
    try {

        const lugarSnapshot = db.collection("lugares_planes").doc(req.query.reference);
        const lugar = await lugarSnapshot.get();


        if (!lugar.exists) {
            res.status(404).json({ error: "Lugar not found" });
        }

        await db
            .collection("lugares_planes")
            .doc(req.query.reference)
            .delete();


        res.status(200).json(lugar);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", error });
    }
};
