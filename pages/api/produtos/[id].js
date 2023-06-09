import { deleteProductById, getProductById, updateProduct } from "../../../services/produtos";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const product = await getProductById(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

    } else if (req.method === 'DELETE') {
        try {
            await deleteProductById(id);
            res.status(200).json("Produto excluido com sucesso");
        } catch (error) {
            res.status(400).json(error.message);
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedProduct = await updateProduct(id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}
