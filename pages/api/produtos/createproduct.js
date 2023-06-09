import { addProducts } from "../../../services/produtos";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Metodo post")
        try {
            const products = await addProducts(req.body);
            res.status(200).json("Item criado com sucesso!");
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}