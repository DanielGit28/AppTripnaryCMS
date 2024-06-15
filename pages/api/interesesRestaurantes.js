import { db } from "../../lib/firebase";


export const createInteresesRestaurantesHandler = async (req) => {
  const {
    cantidadDias,
    idPrompts,
    tipoComida,
    estado,
    nombreCiudad
  } = req;

  try {
    const newInteresesRestaurantes = {
        cantidadDias: cantidadDias,
        idPrompts: idPrompts,
        tipoComida: tipoComida,
        estado: estado,
        nombreCiudad: nombreCiudad,
    };
    const ref = await db.collection('intereses_restaurantes').add(newInteresesRestaurantes)
    const InteresesLugares = {
      ...newInteresesRestaurantes,
      id: ref.id
    };
    return InteresesLugares
  } catch (e) {
    console.error('Final error intereses restaurantes post: ', e);
  }
}




