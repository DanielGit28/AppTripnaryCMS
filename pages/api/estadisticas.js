import { get } from "react-hook-form";
import { db } from "../../lib/firebase";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await getEstadisticasGeneralesHandler(req, res);
  }
}

const getEstadisticasGeneralesHandler = async (req, res) => {
  try {
    let estadisticas = {};

    let administradores = 0;
    let estadoAdmins = 0;
    let usuarios = 0;
    let estadoUsuarios = 0;
    let invitados = 0;
    let estadoInvitados = 0;
    let planesViaje = 0;
    let estadoPlanesViaje = 0;
    let lugaresRecomendados = 0;
    let estadoLugaresRecomendados = 0;

    const collectionUsuariosSnap = await db.collection("usuarios").get();

    const collectionUsuarios = collectionUsuariosSnap.docs.map((doc) => ({
      reference: doc.id,
      ...doc.data(),
    }));

    collectionUsuarios.forEach(usuario => {
        if(usuario.roles.includes("Administrador")){
            administradores++;
            
            if(usuario.estado == "Activo"){
                estadoAdmins++;
            }

            return;
        }else if(usuario.roles.includes("Usuario")){
            usuarios++;

            if(usuario.estado == "Activo"){
                estadoUsuarios++;
            }

            return;
        }else if(usuario.roles.includes("Invitado")){
            invitados++;

            if(usuario.estado == "Activo"){
                estadoInvitados++;
            }

            return;
        }
    });

    const collectionPlanesViajeSnap = await db.collection("planes_viajes").get();

    const collectionPlanesViaje = collectionPlanesViajeSnap.docs.map((doc) => ({
        reference: doc.id,
        ...doc.data(),
    }));

    planesViaje = collectionPlanesViaje.length;

    collectionPlanesViaje.forEach(plan => {
        if(plan.estado == "Activo"){
            estadoPlanesViaje++;
        }
    });

    const collectionLugaresRecomendadosSnap = await db.collection("lugares_recomendados").get();

    const collectionLugaresRecomendados = collectionLugaresRecomendadosSnap.docs.map((doc) => ({
        reference: doc.id,
        ...doc.data(),
    }));

    lugaresRecomendados = collectionLugaresRecomendados.length;

    collectionLugaresRecomendados.forEach(lugar => {
        if(lugar.estado == "Activo"){
            estadoLugaresRecomendados++;
        }
    });

    estadisticas = {
        administradores: administradores,
        estadoAdmins: estadoAdmins,
        usuarios: usuarios,
        estadoUsuarios: estadoUsuarios,
        invitados: invitados,
        estadoInvitados: estadoInvitados,
        planesViaje: planesViaje,
        estadoPlanesViaje: estadoPlanesViaje,
        lugaresRecomendados: lugaresRecomendados,
        estadoLugaresRecomendados: estadoLugaresRecomendados
    }

    res.status(200).json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};