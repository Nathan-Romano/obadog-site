import { getEsperaById, updateEntrega } from "../../../services/espera";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const espera = await getEsperaById(id);
            res.status(200).json(espera);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedState = await updateEntrega(id, req.body);
            res.status(200).json(updatedState);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } 
}