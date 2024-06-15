import { db } from "../../lib/firebase";
import { parse, addDays, subDays, format } from 'date-fns';


export default async function handler(req, res) {
    if (req.method === "GET") {
        if (req.query.reference) {
            await getPlanByIdUsuarioHandler(req, res);
        } else {
            await getPlanesViajesHandler(res);
        }
    } else if (req.method === "POST") {
        await createPlanViajeHandler(req, res);
    } else if (req.method === "PUT") {
        if (req.query.updatePlanDias) {
            await updatePlanDiasHandler(req, res);
        } else {
            await updatePlanViajeHandler(req, res);
        }

    } else if (req.method === "DELETE") {
        await deleteViajeHandler(req, res); 
    }

}

const createPlanViajeHandler = async (req, res) => {
    const {
        nombre: nombre,
        estado: estado,
        imagenPortada: imagenPortada,
        idUsuario: idUsuario,
        idPromptHotel: idPromptHotel,
        idPais: idPais,
        idInteresRestaurante: idInteresRestaurante,
        idInteresLugar: idInteresLugar,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    } = req.body;

    try {
        const newPlanViaje = {
            nombre: nombre,
            estado: estado,
            imagenPortada: imagenPortada,
            idUsuario: idUsuario,
            idPromptHotel: idPromptHotel,
            idPais: idPais,
            idInteresRestaurante: idInteresRestaurante,
            idInteresLugar: idInteresLugar,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        };

        newPlanViaje.imagenPortada = await getDocumentoByImagenHandler();

        const ref = await db.collection("planes_viajes").add(newPlanViaje);


        const planViaje = {
            ...newPlanViaje,
            reference: ref.id,
        };

        const fechasEntre = await obtenerFechasEntre(planViaje.fechaInicio, planViaje.fechaFin);

        for (let i = 0; i < fechasEntre.length; i++) {
            await createDiaViajeHandler(i + 1, fechasEntre[i], planViaje.reference);

        }

        res.status(200).json(planViaje);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const updatePlanDiasHandler = async (req, res) => {

    let tipoUpdate = req.query.updatePlanDias;

    try {
        const {
            reference: reference,
            nombre: nombre,
            estado: estado,
            imagenPortada: imagenPortada,
            idUsuario: idUsuario,
            idPromptHotel: idPromptHotel,
            idPais: idPais,
            idInteresRestaurante: idInteresRestaurante,
            idInteresLugar: idInteresLugar,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        } = req.body;

        const planSnapshot = db.collection("planes_viajes").doc(reference);
        const plan = await planSnapshot.get();

        if (!plan.exists) {
            res.status(404).json({ error: "Plan not found" });
        } else {
            const updatedPlan = {
                reference: reference,
                nombre: nombre || lugar.data().nombre,
                estado: estado || lugar.data().estado,
                imagenPortada: imagenPortada || plan.data().imagenPortada,
                idUsuario: idUsuario || plan.data().idUsuario,
                idPromptHotel: idPromptHotel || plan.data().idPromptHotel,
                idPais: idPais || plan.data().idPais,
                idInteresRestaurante: idInteresRestaurante || plan.data().idInteresRestaurante,
                idInteresLugar: idInteresLugar || plan.data().idInteresLugar,
                fechaInicio: fechaInicio || plan.data().fechaInicio,
                fechaFin: fechaFin || fechaFin.data().fechaFin,
            };

            if (tipoUpdate == "AgregarDia") {
                updatedPlan.fechaFin = await actualizacionFechas(updatedPlan.fechaFin, "sumar")
                await actualizarDiasPlan(updatedPlan.fechaFin, "sumar", reference)
            } else {
                updatedPlan.fechaFin = await actualizacionFechas(updatedPlan.fechaFin, "restar")
                await actualizarDiasPlan(updatedPlan.fechaFin, "restar", reference)
            }



            await planSnapshot.update(updatedPlan);
            res.status(200).json(updatedPlan);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getPlanesViajesHandler = async (res) => {
    try {
        const planesSnap = await db
            .collection("planes_viajes")
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


const createDiaViajeHandler = async (dia, fecha, idPlan) => {


    try {
        const newDiaViaje = {
            dia: dia,
            estado: "Activo",
            fecha: fecha,
            idPlanViaje: idPlan
        };

        const ref = await db.collection("dias_planes_viajes").add(newDiaViaje);


        const diaViaje = {
            ...newDiaViaje,
            reference: ref.id,
        };

        return diaViaje;

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const obtenerFechasEntre = async (fechaInicio, fechaFin) => {
    const fechas = [];
    const formato = 'dd/MM/yyyy';
    const fechaActual = parse(fechaInicio, formato, new Date());
    const fechaFinal = parse(fechaFin, formato, new Date());

    while (fechaActual <= fechaFinal) {
        fechas.push(format(fechaActual, formato));
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return fechas;
};

const getPlanByIdUsuarioHandler = async (req, res) => {
    try {
        const planesSnapshot = await db
            .collection("planes_viajes")
            .where("idUsuario", "==", req.query.reference)
            .get();
        const planes = planesSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(planes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const getDiasByPlanHandler = async (idPlanViaje) => {
    try {
        const diasSnapshot = await db
            .collection("dias_planes_viajes")
            .where("idPlanViaje", "==", idPlanViaje)
            .get();
        const dias = diasSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        return dias;
    } catch (e) {
        console.error(e);

    }
};

const actualizarDiasPlan = async (fechaString, operacion, idPlan) => {
    let dias = await getDiasByPlanHandler(idPlan);
    let diasOrdenados = ordenarPorDia(dias);
    if (operacion === 'sumar') {
        await createDiaViajeHandler(diasOrdenados.length + 1, fechaString, idPlan);
    } else {
        let ultimoDia = diasOrdenados[diasOrdenados.length - 1]
        await deleteDiaByReferenceHandler(ultimoDia.reference);
    }
}


const actualizacionFechas = async (fechaString, operacion) => {
    const fecha = parse(fechaString, 'dd/MM/yyyy', new Date());

    let fechaModificada;
    if (operacion === 'sumar') {
        fechaModificada = addDays(fecha, 1);
    } else if (operacion === 'restar') {
        fechaModificada = subDays(fecha, 1);
    } else {
        throw new Error('Operación no válida. Debe ser "sumar" o "restar".');
    }

    const fechaFormateada = format(fechaModificada, 'dd/MM/yyyy');

    return fechaFormateada;
};

const deleteDiaByReferenceHandler = async (reference) => {
    try {
        await db.collection('dias_planes_viajes').doc(reference).delete();

    } catch (error) {
        res.status(500).json({ error: "Something went wrong", error });
    }
}

const ordenarPorDia = (arreglo) => {
    return arreglo.sort((a, b) => a.dia - b.dia);
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


const updatePlanViajeHandler = async (req, res) => {

    try {
        const {
            reference: reference,
            nombre: nombre,
            estado: estado,
            imagenPortada: imagenPortada,
            idUsuario: idUsuario,
            idPromptHotel: idPromptHotel,
            idPais: idPais,
            idInteresRestaurante: idInteresRestaurante,
            idInteresLugar: idInteresLugar,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        } = req.body;

        const planSnapshot = db.collection("planes_viajes").doc(reference);
        const plan = await planSnapshot.get();

        if (!plan.exists) {
            res.status(404).json({ error: "Plan not found" });
        } else {
            const updatedPlan = {
                reference: reference,
                nombre: nombre || lugar.data().nombre,
                estado: estado || lugar.data().estado,
                imagenPortada: imagenPortada || plan.data().imagenPortada,
                idUsuario: idUsuario || plan.data().idUsuario,
                idPromptHotel: idPromptHotel || plan.data().idPromptHotel,
                idPais: idPais || plan.data().idPais,
                idInteresRestaurante: idInteresRestaurante || plan.data().idInteresRestaurante,
                idInteresLugar: idInteresLugar || plan.data().idInteresLugar,
                fechaInicio: fechaInicio || plan.data().fechaInicio,
                fechaFin: fechaFin || fechaFin.data().fechaFin,
            };

            if(updatedPlan.fechaInicio != plan.fechaInicio || updatedPlan.fechaFin != plan.fechaFin) {
                let diasActuales = await getDiasByPlanHandler(updatedPlan.reference);

                const fechasEntre = await obtenerFechasEntre(updatedPlan.fechaInicio, updatedPlan.fechaFin);
    
                let nuevosDiasCreados = []
    
                if (diasActuales.length > 0) {
    
                    for (let i = 0; i < diasActuales.length; i++) {
                        await deleteDiaByReferenceHandler(diasActuales[i].reference);
    
                    }
    
    
                }
    
                for (let i = 0; i < fechasEntre.length; i++) {
                    let newDay = await createDiaViajeHandler(i + 1, fechasEntre[i], updatedPlan.reference);
    
                    nuevosDiasCreados.push(newDay);
    
                }
    
                let lugaresPlanes = await getLugaresPlanesByIdLugarRecomendado(updatedPlan.reference);
    
    
                await asociarLugaresRecomendados(lugaresPlanes, diasActuales, nuevosDiasCreados);
    
                
            }

            await planSnapshot.update(updatedPlan);
            res.status(200).json(updatedPlan);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const getLugaresPlanesByIdLugarRecomendado = async (reference) => {
    try {
        const lugaresSnapshot = await db
            .collection("lugares_planes")
            .where("idPlanViaje", "==", reference)
            .get();
        const lugaresPlanes = lugaresSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));


        return lugaresPlanes;
    } catch (e) {
        console.error(e);
    }
};

const asociarLugaresRecomendados = async (lugaresPlanes, diasActuales, nuevosDiasCreados) => {
    for (let i = 0; i < lugaresPlanes.length; i++) {
        const lugar = lugaresPlanes[i];
        const { reference, idDia } = lugar;

        const diaActual = diasActuales.find((dia) => dia.reference === idDia);


        let nuevoDia = nuevosDiasCreados.find((dia) => dia.dia === diaActual.dia);

        if (!nuevoDia) {
        
            nuevoDia = nuevosDiasCreados.reduce((prev, curr) =>
                Math.abs(curr.dia - diaActual.dia) < Math.abs(prev.dia - diaActual.dia) ? curr : prev
            );
        }

        const updatedLugarRecomendado = {
            ...lugar,
            idDia: nuevoDia.reference,
        };

        await db.collection("lugares_planes").doc(reference).update(updatedLugarRecomendado);
    }
};


const deleteViajeHandler = async (req, res) => {
    try {

        const planesSnapshot = db.collection("planes_viajes").doc(req.query.reference);
        const planes = await planesSnapshot.get();


        if (!planes.exists) {
            res.status(404).json({ error: "Vijae not found" });
        }

        await db
            .collection("planes_viajes")
            .doc(req.query.reference)
            .delete();


        res.status(200).json(planes);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", error });
    }
};
