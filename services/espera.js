import db from "../server/config/db"
import { promisify } from "util";
// Função para obter todos os produtos do banco de dados
export async function getEspera() {
    const query = 'SELECT * FROM espera';
    const result = await promisify(db.query).call(db, query);
    return result;
}

export async function getEsperaById(id) {
    const query = `SELECT * FROM espera WHERE id = ${id}`;
    const result = await promisify(db.query).call(db, query);
    if (result.length === 0) {
        throw new Error("Estado nao encontrado");
    }
    return result[0];
}

//colocar os dois valores no updatestate
export async function updateEntrega(id, body) {
    // Verifica se o produto existe
    const espera = await getEsperaById(id);
    console.log(espera)
    if (!espera) {
        throw new Error("Tempo de espera nao encontrada");
    }
    const query = `
      UPDATE espera SET 
      entrega = '${body.entrega}', 
      retirada = '${body.retirada}' 
      WHERE id = ${id}
    `;
    await promisify(db.query).call(db, query);

    // Retorna o produto atualizado
    const updatedState = {
        id: id,
        entrega: body.entrega,
        retirada: body.retirada,

    };

    return updatedState;
}

// export async function updateRetirada(id, body) {
//     // Verifica se o produto existe
//     const retirada = await getEsperaById(id);
//     console.log(retirada)
//     if (!retirada) {
//         throw new Error("Tempo de espera nao encontrada");
//     }
//     const query = `
//       UPDATE espera SET retirada = '${body.retirada}' WHERE id = ${id}
//     `;
//     await promisify(db.query).call(db, query);

//     // Retorna o produto atualizado
//     const updatedState = {
//         id: id,
//         retirada: body.retirada,
//     };

//     return updatedState;
// }