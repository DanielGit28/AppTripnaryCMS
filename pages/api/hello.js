// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../lib/firebase";


export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.correoElectronico) {
      getUserByEmail(req, res);
    } else {
      getUserHandler(req, res);
    }
  }
}


const getUserHandler = async (req, res) => {
  try {
      const posts = await db.collection('usuarios').get();
      const users = posts.docs.map((doc) =>  ({ reference: doc.id, ...doc.data() }));
      res.status(200).json(users);
  } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Something went wrong' });
  }

}

const getAdmins = async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('usuarios').where('roles', 'array-contains', 'Administrador').get();
    const admins = usuariosSnapshot.docs.map(doc => ({ reference: doc.id, ...doc.data() }));
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

const getUserByEmail = async (req, res) => {
  try {
    const { correoElectronico } = req.query; 
    const usuariosSnapshot = await db.collection('usuarios').where('correoElectronico', '==', correoElectronico).get();
    const usuarios = usuariosSnapshot.docs.map(doc => ({ reference: doc.id, ...doc.data() }));
    
    if (usuarios.length > 0) {
      
      res.status(200).json(usuarios);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}