import { addAdds } from "../../../services/adicionais";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        //console.log("Metodo post")
        try {
            const adds = await addAdds(req.body);
            res.status(200).json("Item criado com sucesso!", adds);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}