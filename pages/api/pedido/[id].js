import { deletePedidoById, getPedidoById, updatePedido, getPedidoItemById } from "../../../services/pedido";

export default async function handler(req, res) {
    const { id } = req.query; // Captura o id da URL
    if (req.method === 'GET') {
        try {
            const pedido = await getPedidoItemById(id);
            res.status(200).json(pedido);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }

    } else if (req.method === 'DELETE') {
        try {
            await deletePedidoById(id);
            res.status(200).json("Pedido excluido com sucesso");
        } catch (error) {
            res.status(400).json(error.message);
        }
    } else if (req.method === 'PUT') {
        try {
            //const { id } = req.params;
            const updatedPedido = await updatePedido(id, req.body);
            res.status(200).json(updatedPedido);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}