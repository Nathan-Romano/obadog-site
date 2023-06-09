import db from "../server/config/db"
import { promisify } from "util";

export async function getBairro() {
    const query = 'SELECT * FROM bairros';
    const result = await promisify(db.query).call(db, query);
    return result;
}
export async function getBairroById(id) {
    const query = `SELECT * FROM bairros WHERE id = ${id}`;
    const result = await promisify(db.query).call(db, query);
    if (result.length === 0) {
        throw new Error("Bairro não encontrado");
    }
    return result[0];
}
export async function addBairro(body) {
    const bairros = await getBairro();
    const bairro = bairros.find(({ nome }) => nome === body.nome);
    const query = `INSERT INTO bairros(nome, taxa) VALUES ('${body.nome}','${body.taxa}')`;
    await promisify(db.query).call(db, query);
    const newBairro = { nome: body.nome, taxa: body.taxa };
    return newBairro;
}
export async function updateBairro(id, body) {
    // Verifica se o produto existe
    const bairro = await getBairroById(id);
    if (!bairro) {
        throw new Error("Produto não encontrado");
    }

    // Verifica se o nome do produto já está sendo usado por outro produto
    const bairros = await getBairro();
    const existingProduct = bairros.find((p) => p.nome === body.nome && p.id !== id);
    // if (existingProduct) {
    //     throw new Error("Já existe um adicional com o mesmo nome");
    // }

    // Executa a query de atualização
    const query = `
      UPDATE bairros
      SET nome = '${body.nome}', 
          taxa = '${body.taxa}' 
      WHERE id = ${id}
    `;
    await promisify(db.query).call(db, query);

    // Retorna o produto atualizado
    const updatedBairro = {
        id: id,
        nome: body.nome,
        taxa: body.taxa,
    };
    return updatedBairro;
}
export async function deleteBairroById(id) {
    // Verifica se o produto existe
    const bairro = await getBairroById(id);
    if (!bairro) {
        throw new Error("Bairro nao encontrado");
    }
    // Executa a query de exclusão
    const query = `DELETE FROM bairros WHERE id = ${id}`;
    await promisify(db.query).call(db, query);
}