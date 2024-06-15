import { db } from "../../lib/firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.hotelesRecomendados) {
      await getHotelesRecomendadosHandler(req, res);
    }
  }
}

const getHotelesRecomendadosHandler = async (req, res) => {
  try {
    console.log(req.query)

    const latitud = req.query.latitud;
    const longitud = req.query.longitud;
    const radio = req.query.radio * 1000;

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLE_API_ALEX}&location=${latitud},${longitud}&radius=${radio}&type=lodging`);

    const responseData = await response.json();

    const hoteles = [];

    responseData.results.forEach((hotel) => {
      let updatedHotel = {
            nombre: hotel.name,
            estado: hotel.business_status,
            puntuacion: hotel.rating,
            // longitud: hotel.geometry.location.lng,
            // latitud: hotel.geometry.location.lat,
            //get only the link from "<a href=\"https://maps.google.com/maps/contrib/111459844616466636631\">Carlos Enrique Rivera Viquez</a>"
            // maps: hotel.photos.html_attributions[0].split('"')[1],
        }

        if(!updatedHotel.puntuacion){
          updatedHotel.puntuacion = "0"
        }

        if(hotel.photos){
          if(hotel.photos[0].photo_reference){
            updatedHotel.imagen = `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.GOOGLE_API_ALEX}&photoreference=${hotel.photos[0].photo_reference}&maxwidth=400`
          }else{
            updatedHotel.imagen = "https://firebasestorage.googleapis.com/v0/b/tripnary-8c3d9.appspot.com/o/hoteles%2Fhotel_placeholder_img.png?alt=media&token=6f3faa44-1e52-4657-a8d6-53a8681b4913"
          }
        }else{
          updatedHotel.imagen = "https://firebasestorage.googleapis.com/v0/b/tripnary-8c3d9.appspot.com/o/hoteles%2Fhotel_placeholder_img.png?alt=media&token=6f3faa44-1e52-4657-a8d6-53a8681b4913"
        }

        if(hotel.photos){
          if(hotel.photos[0].html_attributions[0]){
            updatedHotel.maps = hotel.photos[0].html_attributions[0].split('"')[1]
          }
        }else{
          updatedHotel.maps = "false"
        }

        hoteles.push(updatedHotel)
    })

    console.log("Hoteles", hoteles)

    res.status(200).json(hoteles);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};