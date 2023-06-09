import { addBairro } from "../../../services/bairros";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Metodo post")
        try {
            const bairro = await addBairro(req.body);
            res.status(200).json("Item criado com sucesso!", bairro.nome);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}