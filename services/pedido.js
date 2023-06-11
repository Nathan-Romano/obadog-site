import db from "../server/config/db"
import { promisify } from "util";

// Função para obter todos os produtos do banco de dados
// export async function getPedido() {
//     const query = 'SELECT * FROM pedido';
//     const result = await promisify(db.query).call(db, query);
//     return result;
// }
// // Função para obter um produto pelo ID
// export async function getPedidoById(id) {
//     const query = `SELECT * FROM pedido WHERE id = ${id}`;
//     const result = await promisify(db.query).call(db, query);
//     if (result.length === 0) {
//         throw new Error("Pedido não encontrado");
//     }
//     return result[0];
// }

// Função para obter todos os pedidos com seus itens
export async function getPedidosComItens() {
    const query = `
      SELECT p.*, ip.*
      FROM pedido p
      JOIN item_pedido ip ON p.id = ip.id
    `;
    const result = await promisify(db.query).call(db, query);
    const pedidos = transformarResultados(result);
    return pedidos;
}

function transformarResultados(result) {
    const pedidos = {};
    result.forEach((row) => {
        const pedidoId = row.id;
        if (!pedidos[pedidoId]) {
            pedidos[pedidoId] = {
                id: row.id,
                endereco: row.endereco,
                numero: row.numero,
                status: row.status,
                complemento: row.complemento,
                bairros: row.bairros,
                forma_pagamento: row.forma_pagamento,
                precisa_troco: row.precisa_troco,
                valor_troco: row.valor_troco,
                tempo_min: row.tempo_min,
                taxa_entrega: row.taxa_entrega,
                total: row.total,
                horario_pedido: row.horario_pedido,
                itens: [],
            };
        }
        const itemPedido = {
            item_id: row.item_id,
            nome: row.nome,
            preco: row.preco,
            quantidade: row.quantidade,
            observacao: row.observacao,
            adicional_por_un: row.adicional_por_un,
        };
        pedidos[pedidoId].itens.push(itemPedido);
    });
    return Object.values(pedidos);
}

export async function getPedidoItemById(pedidoId) {
    // Consulta SQL para obter o pedido e seus itens
    const query = `
      SELECT p.*, ip.*
      FROM pedido p
      JOIN item_pedido ip ON p.id = ip.id
      WHERE p.id = ?
    `;

    const result = await promisify(db.query).call(db, query, [pedidoId]);

    // Transformar o resultado em um formato adequado
    const pedido = {
        id: result[0].id,
        endereco: result[0].endereco,
        numero: result[0].numero,
        status: result[0].status,
        complemento: result[0].complemento,
        bairros: result[0].bairros,
        forma_pagamento: result[0].forma_pagamento,
        precisa_troco: result[0].precisa_troco,
        valor_troco: result[0].valor_troco,
        tempo_min: result[0].tempo_min,
        taxa_entrega: result[0].taxa_entrega,
        total: result[0].total,
        horario_pedido: result[0].horario_pedido,
        itens: []
    };

    result.forEach((row) => {
        const itemPedido = {
            id: row.item_id,
            nome: row.nome,
            preco: row.preco,
            quantidade: row.quantidade,
            observacao: row.observacao,
            adicional_por_un: row.adicional_por_un
        };

        pedido.itens.push(itemPedido);
    });

    return pedido;
}

export async function addPedido(pedido) {
    // Inserir o pedido na tabela 'pedido'
    const insertPedidoQuery = `
      INSERT INTO pedido (endereco, numero, status, complemento, bairros, forma_pagamento, precisa_troco, valor_troco, tempo_min, taxa_entrega, total, horario_pedido)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const pedidoValues = [
        pedido.endereco,
        pedido.numero,
        pedido.status,
        pedido.complemento,
        pedido.bairros,
        pedido.forma_pagamento,
        pedido.precisa_troco,
        pedido.valor_troco,
        pedido.tempo_min,
        pedido.taxa_entrega,
        pedido.total,
        pedido.horario_pedido
    ];
    const pedidoResult = await promisify(db.query).call(db, insertPedidoQuery, pedidoValues);

    // Obter o ID do pedido recém-inserido
    const pedidoId = pedidoResult.insertId;

    // Inserir os itens do pedido na tabela 'item_pedido'
    const insertItemPedidoQuery = `
      INSERT INTO item_pedido (id, nome, preco, quantidade, observacao, adicional_por_un)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const itemPedidoValues = pedido.itens.map((item) => [
        pedidoId,
        item.nome,
        item.preco,
        item.quantidade,
        item.observacao,
        item.adicional_por_un
    ]);

    // Executar as consultas de inserção dos itens em lote usando uma única transação
    await promisify(db.beginTransaction).call(db);

    try {
        for (const values of itemPedidoValues) {
            await promisify(db.query).call(db, insertItemPedidoQuery, values);
        }

        // Commit da transação
        await promisify(db.commit).call(db);

        return {
            id: pedidoId,
            endereco: pedido.endereco,
            complemento: pedido.complemento,
            numero: pedido.numero,
            status: pedido.status,
            bairros: pedido.bairros,
            forma_pagamento: pedido.forma_pagamento,
            precisa_troco: pedido.precisa_troco,
            valor_troco: pedido.valor_troco,
            tempo_min: pedido.tempo_min,
            taxa_entrega: pedido.taxa_entrega,
            total: pedido.total,
            horario_pedido: pedido.horario_pedido,
            itens: pedido.itens //
        }
    } catch (error) {
        // Rollback da transação em caso de erro
        await promisify(db.rollback).call(db);
        throw error;
    }
}

export async function updatePedido(id, body) {
    // Verifica se o pedido existe
    const pedido = await getPedidoItemById(id);
    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }
  
    // Executa a query de atualização
    const query = `
      UPDATE pedido
      SET endereco = ?,
          numero = ?,
          status = ?,
          complemento = ?,
          bairros = ?,
          forma_pagamento = ?,
          precisa_troco = ?,
          valor_troco = ?,
          tempo_min = ?,
          taxa_entrega = ?,
          total = ?,
          horario_pedido = ?
      WHERE id = ?
    `;
    const values = [
      body.endereco,
      body.numero,
      body.status,
      body.complemento,
      body.bairros,
      body.forma_pagamento,
      body.precisa_troco,
      body.valor_troco,
      body.tempo_min,
      body.taxa_entrega,
      body.total,
      body.horario_pedido,
      id,
    ];
    await promisify(db.query).call(db, query, values);
  
    // Retorna o pedido atualizado
    const updatedPedido = {
      id: id,
      endereco: body.endereco,
      numero: body.numero,
      status: body.status,
      complemento: body.complemento,
      bairros: body.bairros,
      forma_pagamento: body.forma_pagamento,
      precisa_troco: body.precisa_troco,
      valor_troco: body.valor_troco,
      tempo_min: body.tempo_min,
      taxa_entrega: body.taxa_entrega,
      total: body.total,
      horario_pedido: body.horario_pedido,
      itens: pedido.itens,
    };
  
    return updatedPedido;
  }
// Função para deletar um pedido pelo ID
export async function deletePedidoById(id) {
    // Verifica se o pedido existe
    const pedido = await getPedidoItemById(id);
    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    // Inicia uma transação no banco de dados
    await promisify(db.beginTransaction).call(db);

    try {
        // Deleta os itens do pedido na tabela 'item_pedido'
        const deleteItemPedidoQuery = `DELETE FROM item_pedido WHERE id = ${id}`;
        await promisify(db.query).call(db, deleteItemPedidoQuery);

        // Deleta o pedido na tabela 'pedido'
        const deletePedidoQuery = `DELETE FROM pedido WHERE id = ${id}`;
        await promisify(db.query).call(db, deletePedidoQuery);

        // Confirma a transação
        await promisify(db.commit).call(db);

        return true;
    } catch (error) {
        // Desfaz a transação em caso de erro
        await promisify(db.rollback).call(db);
        throw error;
    }
}
