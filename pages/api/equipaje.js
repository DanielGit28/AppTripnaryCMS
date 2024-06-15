import { db } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        if (req.query.idPlanViaje) {
            await getEquipajeByPlanHandler(req, res);
        } else {
            await getEquipajeHandler(res);
        }
    } else if (req.method === "POST") { 
        await createEquipajeHandler(req, res);
    } else if (req.method === "PUT") { 
        await updateEquipajeHandler(req, res);
    } else if (req.method === "DELETE") { 
        await deleteEquipajeByReferenceHandler(req, res);
    }

}



const createEquipajeHandler = async (req, res) => {
    const {
        nombre,
        cantidad,
        completado,
        idPlanViaje,
        estado,
    } = req.body;

    try {
        const newEquipaje = {
            nombre: nombre,
            cantidad: cantidad,
            completado: completado,
            idPlanViaje: idPlanViaje,
            estado: estado,
        };
        const ref = await db.collection("equipaje").add(newEquipaje);

        const equipaje = {
            ...newEquipaje,
            reference: ref.id,
        };
        res.status(200).json(equipaje);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};



const getEquipajeByPlanHandler = async (req, res) => {
    try {
        const equipajeSnapshot = await db
            .collection("equipaje")
            .where("idPlanViaje", "==", req.query.idPlanViaje)
            .get();
        const equipaje = equipajeSnapshot.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(equipaje);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const getEquipajeHandler = async (res) => {
    try {
        const equipajeSnap = await db
            .collection("equipaje")
            .get();
        const equipaje = equipajeSnap.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(equipaje);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

const updateEquipajeHandler = async (req, res) => {
    try {
        const {
            reference,
            nombre,
            cantidad,
            completado,
            idPlanViaje,
            estado,
        } = req.body;


        const equipajeSnapshot = db.collection("equipaje").doc(reference);
        const equipaje = await equipajeSnapshot.get();

        if (!equipaje.exists) {
            res.status(404).json({ error: "Equipaje not found" });
        } else {
            const updatedEquipaje = {
                estado: estado || equipaje.data().estado,
                nombre: nombre || equipaje.data().nombre,
                cantidad: cantidad || equipaje.data().cantidad,
                idPlanViaje: idPlanViaje || equipaje.data().idPlanViaje,
                completado: completado !== undefined ? completado : equipaje.data().completado
            };

        
            await equipajeSnapshot.update(updatedEquipaje);
            res.status(200).json(updatedEquipaje);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const deleteEquipajeByReferenceHandler = async (req, res) => {
    try {

        const equipajeSnapshot = db.collection("equipaje").doc(req.query.reference);
        const equipaje = await equipajeSnapshot.get();


        if (!equipaje.exists) {
            res.status(404).json({ error: "Equipaje not found" });
        }

        await db
            .collection("equipaje")
            .doc(req.query.reference)
            .delete();


        res.status(200).json(equipaje);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", error });
    }
};
