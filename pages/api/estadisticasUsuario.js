import { get } from "react-hook-form";
import { db } from "../../lib/firebase";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await getEstadisticasUsuario(req, res);
    }
}


const getCantidadPlanes = async (reference) => {

    try {
        const planesSnapshot = await db
            .collection("planes_viajes")
            .where("idUsuario", "==", reference)
            .get();
        const planes = planesSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        return planes;
    } catch (e) {
        console.error(e);

    }
};

const getLugaresRecomendados = async (reference) => {

    try {
        const lugaresPlanesSnapshot = await db
            .collection("lugares_planes")
            .where("idPlanViaje", "==", reference)
            .get();
        const lugaresPlanes = lugaresPlanesSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        const lugares = new Set();

        for (const doc of lugaresPlanes) {
            const lugar = doc;
            if (lugar.idLugarRecomendado != "null") {
                let lugarObj = await getLugarHandler(lugar.idLugarRecomendado);
                console.log(lugarObj);
                lugares.add(lugarObj);
            }
        }

        return lugares;
    } catch (e) {
        console.error(e);

    }
};

const getLugarHandler = async (reference) => {
    try {

        const lugarSnapshot = await db.collection("lugares_recomendados").doc(reference).get();
        const lugar = await lugarSnapshot.data();

        return lugar;
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};



const getCantidadPaisesVisitados = async (planesSnapshot) => {
    try {

        const paisesVisitados = new Set();

        planesSnapshot.forEach((doc) => {
            const plan = doc;
            if (plan.idPais && !paisesVisitados.has(plan.idPais)) {
                paisesVisitados.add(plan.idPais);
            }
        });

        return paisesVisitados.size;
    } catch (e) {
        console.error(e);
    }
};

const getCantidadCiudadesVisitadas = async (lugaresSnapshot) => {
    try {

        const ciudadesVisitados = new Set();

        lugaresSnapshot.forEach((doc) => {
            const lugar = doc;
            if (lugar.idCiudad && !ciudadesVisitados.has(lugar.idCiudad)) {
                ciudadesVisitados.add(lugar.idCiudad);
            }
        });

        return ciudadesVisitados.size;
    } catch (e) {
        console.error(e);
    }
};


const getLugares = async (planesSnapshot) => {
    try {
        const lugaresVisitados = new Set();

        for (const doc of planesSnapshot) {
            const plan = doc;

            let lugaresRecomendados = await getLugaresRecomendados(plan.reference);
            
            for (const lugar of lugaresRecomendados) {
                lugaresVisitados.add(lugar);
            }
        }

        return lugaresVisitados;
    } catch (e) {
        console.error(e);
    }
};

const getEstadisticasUsuario = async (req, res) => {

    try {
        let planesViajes = await getCantidadPlanes(req.query.reference);
        let paisesVisitados = await getCantidadPaisesVisitados(planesViajes);
        let lugaresRecomendados = await getLugares(planesViajes);

        let cantidadCiudades = await getCantidadCiudadesVisitadas(lugaresRecomendados);

        const estadisticas = {
            cantidadPlanes: planesViajes.length,
            cantidadPaises: paisesVisitados,
            cantidadCiudades: cantidadCiudades,
            cantidadLugares: lugaresRecomendados.size,
        }

        res.status(200).json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}