import { getOperacao } from "../../../services/operacao"


export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const estado = await getOperacao();
            res.status(200).json(estado)
        } catch (error) {
            res.status(400).json( error.message );
        }
    }
}
