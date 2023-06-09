import db from "../server/config/db"
import { promisify } from "util";

export async function getAdd() {
    const query = 'SELECT * FROM adicionais';
    const result = await promisify(db.query).call(db, query);
    return result;
}
export async function getAddById(id) {
    const query = `SELECT * FROM adicionais WHERE id = ${id}`;
    const result = await promisify(db.query).call(db, query);
    if (result.length === 0) {
        throw new Error("Adicional não encontrado");
    }
    return result[0];
}
export async function addAdds(body) {
    const adds = await getAdd();
    const add = adds.find(({ nome }) => nome === body.nome);
    const query = `INSERT INTO adicionais(nome, preco) VALUES ('${body.nome}','${body.preco}')`;
    await promisify(db.query).call(db, query);
    const newAdd = { nome: body.nome, preco: body.preco };
    return newAdd;
}
export async function updateAdd(id, body) {
    // Verifica se o produto existe
    const add = await getAddById(id);
    if (!add) {
        throw new Error("Produto não encontrado");
    }

    // Verifica se o nome do produto já está sendo usado por outro produto
    const adds = await getAdd();
    const existingProduct = adds.find((p) => p.nome === body.nome && p.id !== id);
    // if (existingProduct) {
    //     throw new Error("Já existe um adicional com o mesmo nome");
    // }

    // Executa a query de atualização
    const query = `
      UPDATE adicionais
      SET nome = '${body.nome}', 
          preco = '${body.preco}' 
      WHERE id = ${id}
    `;
    await promisify(db.query).call(db, query);

    // Retorna o produto atualizado
    const updatedAdd = {
        id: id,
        nome: body.nome,
        preco: body.preco,
    };
    return updatedAdd;
}
export async function deleteAddById(id) {
    // Verifica se o produto existe
    const add = await getAddById(id);
    if (!add) {
        throw new Error("Adicional nao encontrado");
    }
    // Executa a query de exclusão
    const query = `DELETE FROM adicionais WHERE id = ${id}`;
    await promisify(db.query).call(db, query);
}