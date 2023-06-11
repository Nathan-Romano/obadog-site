import { getPedidosComItens } from "../../../services/pedido"


export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const pedido = await getPedidosComItens();
            res.status(200).json(pedido)
        } catch (error) {
            res.status(400).json( error.message );
        }
    }
}
