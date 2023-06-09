import { deleteAddById, getAddById, updateAdd } from "../../../services/adicionais";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const add = await getAddById(id);
            res.status(200).json(add);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

    } else if (req.method === 'DELETE') {
        try {
            await deleteAddById(id);
            res.status(200).json("Adicional excluido com sucesso");
        } catch (error) {
            res.status(400).json(error.message);
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedAdd = await updateAdd(id, req.body);
            res.status(200).json(updatedAdd);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}