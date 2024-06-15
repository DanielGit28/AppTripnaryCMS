import { db } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        if (req.query.vuelosRecomendados) {
            await getVuelosRecomendadosHandler(req, res);
        } else {
            await getAllVuelosHandler(req, res);
        }
    }
}

const getVuelosRecomendadosHandler = async (req, res) => {
    try {
        console.log("req", req.query)
        const accessToken = await getAccessToken();

        if(req.query.departureDate.includes("/")){
            const departure = req.query.departureDate.split("/");
            req.query.departureDate = `${departure[2]}-${departure[1]}-${departure[0]}`;

            // const returnD = req.query.returnDate.split("/");
            // req.query.returnDate = `${returnD[2]}-${returnD[1]}-${returnD[0]}`;
        }

        console.log("req", req.query)

        const originLocationCode = req.query.originLocationCode;
        const destinationLocationCode = req.query.destinationLocationCode;
        const departureDate = req.query.departureDate;
        const returnDate = req.query.returnDate;
        const adults = req.query.adults;
        const max = req.query.max;

        const vuelos = [];

        const response = await
            // fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=${max}`, {
            fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&adults=${adults}&max=${max}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        const responseData = await response.json();

        console.log(responseData)

        responseData?.data?.forEach(res => {

            const vuelo = {
                cantidadMaletas: res.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
                categoriaVuela: res.travelerPricings[0].fareDetailsBySegment[0].cabin,
                codigoAerolinea: res.itineraries[0].segments[0].carrierCode,
                origen: res.itineraries[0].segments[0].departure.iataCode,
                destino: res.itineraries[0].segments[res.itineraries[0].segments.length - 1].arrival.iataCode,
                fecha: null,
                fechaSalida: res.itineraries[0].segments[0].departure.at,
                fechaLlegada: res.itineraries[0].segments[0].arrival.at,
                duracion: res.itineraries[0].duration.substring(2),
                hora: null,
                idPlanViaje: null,
                moneda: "USD",
                // paradas: res.itineraries[0].segments[0].numberOfStops,
                precio: (res.price.total * 1.10).toFixed(2),
                tipoViajero: res.travelerPricings[0].travelerType,
            }
            // console.log(vuelo)

            vuelo.paradas = res.itineraries[0].segments.map(segment => segment.departure.iataCode);
            vuelo.paradas.push(destinationLocationCode);

            vuelo.paradas = vuelo.paradas.join("→");
            vuelo.paradas = vuelo.paradas + "/" + (res.itineraries[0].segments.length - 1);

            vuelos.push(vuelo);
        });

        res.status(200).json(vuelos);

    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

const getAccessToken = async () => {
    try {
        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_FLIGHT_API_KEY}&client_secret=${process.env.AMADEUS_FLIGHT_API_SECRET}`,
        });

        const data = await response.json();

        return data.access_token;
    } catch (e) {
        console.log(e);
    }
}

const getAllVuelosHandler = async (req, res) => {
    try {
        const vuelosSnap = await db.collection("vuelos").get();

        const vuelos = vuelosSnap.docs.map((doc) => ({
            reference: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(vuelos);
    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}