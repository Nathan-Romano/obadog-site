import db from "../server/config/db"
import { promisify } from "util";
import jwt from "jsonwebtoken"

// é o backend na camada de serviços, repsonsavel pelas chamadas externas e conexão com bd

const SECRET = process.env.JWT_SECRET

function createToken(user) {
    return jwt.sign({ name: user.username }, SECRET)
}

function readToken(token) {
    try {
        return jwt.verify(token, SECRET)
    } catch (error) {
        throw new Error("token invalido")
    }
}
export function verifica(token) {
    return readToken(token)
}
// Função para obter todos os usuários do banco de dados
export async function getUsers() {
    const query = 'SELECT * FROM usuario_admin';
    const result = await promisify(db.query).call(db, query);
    return result;
}
// Função para criar um novo usuário administrador
export async function createAdmin(body) {
    const users = await getUsers();
    const user = users.find(({ username }) => username === body.username);
    //console.log(user.username)
    if (user) throw new Error("usuario ja cadastrado");
    const query = `INSERT INTO usuario_admin (username, password) VALUES ('${body.username}', '${body.password}')`;
    await promisify(db.query).call(db, query);
    const newUser = { username: body.username, password: body.password };
    const token = createToken(newUser);
    return token;
}
// Função para realizar o login do usuário
export async function login(body) {
    const users = await getUsers();
    const user = users.find(({ username }) => username === body.username);
    if (!user) throw new Error("usuario não encontrado");
    if (user.password !== body.password) throw new Error("Senha incorreta");
    const token = createToken(user);
    return token
}



