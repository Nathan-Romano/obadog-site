import { getAdd } from "../../../services/adicionais"

export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const add = await getAdd();
            res.status(200).json(add)
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}
