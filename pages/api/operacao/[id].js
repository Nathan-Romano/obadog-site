import { getOperacaoById, updateOperacao } from "../../../services/operacao";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const estado = await getOperacaoById(id);
            res.status(200).json(estado);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedState = await updateOperacao(id, req.body);
            res.status(200).json(updatedState);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}