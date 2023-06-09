import { getProducts } from "../../../services/produtos"


export default async function handlerGet(req, res) {
    if (req.method === 'GET') {
        try {
            const products = await getProducts();
            res.status(200).json(products)
        } catch (error) {
            res.status(400).json( error.message );
        }
    }
}



