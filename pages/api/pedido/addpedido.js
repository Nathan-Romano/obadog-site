import { addPedido } from "../../../services/pedido";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Metodo post")
        try {
            const pedido = await addPedido(req.body);
            res.status(200).json(pedido);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}