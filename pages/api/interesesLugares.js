import { db } from "../../lib/firebase";


export const createInteresesLugaresHandler = async (req) => {
  const {
    cantidadDias,
    idPrompts,
    lugarPreferido,
    estado,
    nombreCiudad,
    presupuesto
  } = req;

  try {
    const newInteresesLugares = {
        cantidadDias: cantidadDias,
        idPrompts: idPrompts,
        lugarPreferido: lugarPreferido,
        estado: estado,
        nombreCiudad: nombreCiudad,
        presupuesto: presupuesto
    };
    const ref = await db.collection('intereses_lugares').add(newInteresesLugares)
    const InteresesLugares = {
      ...newInteresesLugares,
      id: ref.id
    };
    return InteresesLugares
  } catch (e) {
    console.error('Final error: ', e);
  }
}




