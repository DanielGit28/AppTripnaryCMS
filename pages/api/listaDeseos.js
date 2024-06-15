import { db } from "../../lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if(req.query.reference){
      await getListaDeseosHandler(req, res);
    }else if(req.query.idUsuario){
        await getListaDeseosByUserHandler(req, res);
    }else{
      await getListaDeseosHandler(req, res);
    }
  }else if(req.method === "POST"){
    await addListaDeseosHandler(req, res);
  }else if(req.method === "DELETE"){
    await deleteListaDeseosByReferenceHandler(req, res);
  }
}

const getListaDeseosHandler  = async (req, res) => {
    try {
      const snap = await db.collection("listas_deseos").get();

      const listaDeseos = snap.docs.map((doc) => ({
        reference: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json(listaDeseos);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
};

const getListaDeseosByUserHandler  = async (req, res) => {
    try {
      const snapshot = await db.collection("listas_deseos").where("idUsuario", "==", req.query.idUsuario).get();
      
      const listaDeseosUsuario = snapshot.docs.map((doc) => ({
        reference: doc.id,
        ...doc.data(),
      }));

      for (let i = 0; i < listaDeseosUsuario.length; i++) {
        const lugarSnapshot = await db.collection("lugares_recomendados").doc(listaDeseosUsuario[i].idLugar).get();
        listaDeseosUsuario[i].nombre = lugarSnapshot.data().nombre;
        listaDeseosUsuario[i].categoriaViaje = lugarSnapshot.data().categoriaViaje;
        listaDeseosUsuario[i].descripcion = lugarSnapshot.data().descripcion;
        listaDeseosUsuario[i].imagen = lugarSnapshot.data().imagen;
      }
  
      res.status(200).json(listaDeseosUsuario);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};


const addListaDeseosHandler = async (req, res) => {
  try{
      const listaDeseos = {
          idUsuario: req.body.idUsuario,
          idLugar: req.body.idLugar,
          estado: req.body.estado,
      }

      await db.collection("listas_deseos").add(listaDeseos)

      res.status(200).json({ message: "Lista deseos agregada"});
  }catch (error) {
      res.status(500).json({ error: "Something went wrong" });
  }
}

const deleteListaDeseosByReferenceHandler = async (req, res) => {
  try{
    await db.collection('listas_deseos').doc(req.query.reference).delete();

    res.status(200).json({ message: "Lista Deseos eliminada"});
  }catch (error) {
      res.status(500).json({ error: "Something went wrong", error });
  }
}

