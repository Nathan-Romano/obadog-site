import db from "../server/config/db"
import { promisify } from "util";
// Função para obter todos os produtos do banco de dados
export async function getProducts() {
    const query = 'SELECT * FROM produtos';
    const result = await promisify(db.query).call(db, query);
    return result;
}
// Função para obter um produto pelo ID
export async function getProductById(id) {
    const query = `SELECT * FROM produtos WHERE id = ${id}`;
    const result = await promisify(db.query).call(db, query);
    if (result.length === 0) {
        throw new Error("Produto não encontrado");
    }
    return result[0];
}
// Função para adicionar um novo produto ao banco de dados
export async function addProducts(body) {
    const products = await getProducts();
    const product = products.find(({ nome }) => nome === body.nome);
    const query = `INSERT INTO produtos(foto, nome, descricao, preco, categoria) VALUES ('${body.foto}', '${body.nome}','${body.descricao}','${body.preco}','${body.categoria}')`;
    await promisify(db.query).call(db, query);
    const newProduct = { foto: body.foto, nome: body.nome, descricao: body.descricao, preco: body.preco, categoria: body.categoria };
    return newProduct;
}
// Função para atualizar um produto no banco de dados
export async function updateProduct(id, body) {
    // Verifica se o produto existe
    const product = await getProductById(id);
    if (!product) {
        throw new Error("Produto não encontrado");
    }

    // Verifica se o nome do produto já está sendo usado por outro produto
    const products = await getProducts();
    const existingProduct = products.find((p) => p.nome === body.nome && p.id !== id);
    // if (existingProduct) {
    //     throw new Error("Já existe um produto com o mesmo nome");
    // }

    // Executa a query de atualização
    const query = `
      UPDATE produtos
      SET foto = '${body.foto}', 
          nome = '${body.nome}', 
          descricao = '${body.descricao}', 
          preco = '${body.preco}', 
          categoria = '${body.categoria}'
      WHERE id = ${id}
    `;
    await promisify(db.query).call(db, query);

    // Retorna o produto atualizado
    const updatedProduct = {
        id: id,
        foto: body.foto,
        nome: body.nome,
        descricao: body.descricao,
        preco: body.preco,
        categoria: body.categoria
    };

    return updatedProduct;
}
// Função para deletar um produto pelo ID
export async function deleteProductById(id) {
    // Verifica se o produto existe
    const product = await getProductById(id);
    if (!product) {
        throw new Error("Product not found");
    }
    // Executa a query de exclusão
    const query = `DELETE FROM produtos WHERE id = ${id}`;
    await promisify(db.query).call(db, query);
}