import { getEspera } from "../../../services/espera"


export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const espera = await getEspera();
            res.status(200).json(espera)
        } catch (error) {
            res.status(400).json( error.message );
        }
    }
}
