import db from "../server/config/db"
import { promisify } from "util";
// Função para obter todos os produtos do banco de dados
export async function getOperacao() {
    const query = 'SELECT * FROM operacao';
    const result = await promisify(db.query).call(db, query);
    return result;
}

export async function getOperacaoById(id) {
    const query = `SELECT * FROM operacao WHERE id = ${id}`;
    const result = await promisify(db.query).call(db, query);
    if (result.length === 0) {
        throw new Error("Estado nao encontrado");
    }
    return result[0];
}


export async function updateOperacao(id, body) {
    // Verifica se o produto existe
    const estado = await getOperacaoById(id);
    console.log(estado)
    if (!estado) {
        throw new Error("Estado nao encontrada");
    }
    const query = `
      UPDATE operacao SET estado = '${body.estado}' WHERE id = ${id}
    `;
    await promisify(db.query).call(db, query);

    // Retorna o produto atualizado
    const updatedState = {
        id: id,
        estado: body.estado,
    };

    return updatedState;
}

