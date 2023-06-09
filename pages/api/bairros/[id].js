import { deleteBairroById, getBairroById, updateBairro } from "../../../services/bairros";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const bairro = await getBairroById(id);
            res.status(200).json(bairro);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

    } else if (req.method === 'DELETE') {
        try {
            await deleteBairroById(id);
            res.status(200).json("Bairro excluido com sucesso");
        } catch (error) {
            res.status(400).json(error.message);
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedBairro = await updateBairro(id, req.body);
            res.status(200).json(updatedBairro);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}