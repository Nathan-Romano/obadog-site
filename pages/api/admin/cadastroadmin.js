import { createAdmin } from "../../../services/user";

// export default async function handlerGet(req, res) {
//     try {
//         const users = await getUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(400).json(error.message);
//     }

// }

export default async function handler(req, res) {
    try {
        const newUser = await createAdmin(req.body);
        res.status(201).json(newUser);
        //res.json({message:"teste"});
    } catch (error) {
        res.status(400).json(error.message);
    }
}