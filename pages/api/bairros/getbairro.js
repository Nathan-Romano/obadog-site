import { getBairro } from "../../../services/bairros"

export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const add = await getBairro();
            res.status(200).json(add)
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}