import React, { useEffect, useState } from 'react'

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [statusPedido, setStatusPedido] = useState(0);

  async function fetchPedidos() {
    try {
      const res = await fetch('/api/pedido/getpedido', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleFinalizarPedido(pedidosId) {
    try {
      const pedido = pedidos.find((pedido) => pedido.id === pedidosId);
      const updatedPedido = { ...pedido, status: 1 };

      const res = await fetch(`/api/pedido/${pedidosId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPedido),
      });
      fetchPedidos()
      const json = await res.json();
      if (res.status !== 200) throw new Error(json);

    } catch (error) {
      console.error(error);
    }
  }


  async function handleExcluirPedido(pedidoId) {
    try {
      const res = await fetch(`/api/pedido/${pedidoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        // Atualize a lista de pedidos após a exclusão bem-sucedida
        fetchPedidos();
      } else {
        console.error('Erro ao excluir o pedido');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido) => pedido.status === statusPedido);

  return (
    <div className="bg-gray-900 w-full h-screen flex justify-center items-center min-w-full">
      <div className="max-w-5xl w-full bg-gray-800 shadow-sm rounded-lg p-5 overflow-x-auto">
        <div className="p-4 text-gray-200 inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className='overflow-x-auto md:flex-col'>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center sm:-mx-6 lg:-mx-8">Pedidos</h2>
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg mr-4 ${statusPedido === 0 ? 'bg-opacity-100' : 'bg-opacity-50'
                  }`}
                onClick={() => setStatusPedido(0)}
              >
                Pedidos em Preparação
              </button>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${statusPedido === 1 ? 'bg-opacity-100' : 'bg-opacity-50'
                  }`}
                onClick={() => setStatusPedido(1)}
              >
                Pedidos Finalizados
              </button>
            </div>
            <table className="w-auto min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="p-2 border border-gray-400">Pedido ID</th>
                  <th className="p-2 border border-gray-400">Endereço</th>
                  <th className="p-2 border border-gray-400">Forma de Pagamento</th>
                  <th className="p-2 border border-gray-400">Horário do Pedido</th>
                  <th className="p-2 border border-gray-400">Itens do Carrinho</th>
                  <th className="p-2 border border-gray-400">Total</th>
                  <th className="p-2 border border-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados?.map((pedido) => (
                  <tr className="bg-white border rounded-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={pedido.id}>
                    <td className="p-2 border border-gray-400">{pedido.id} Status: {pedido.status}</td>
                    <td className="p-2 border border-gray-400">{pedido.endereco} Taxa: R${pedido.taxa_entrega.toFixed(2)}</td>
                    <td className="p-2 border border-gray-400">{pedido.forma_pagamento}</td>
                    <td className="p-2 border border-gray-400">{pedido.horario_pedido}</td>
                    <td className="p-2 border border-gray-400">
                      <ul className='overflow-y-auto h-32'>
                        {pedido.itens.map((item) => (
                          <li key={item.item_id} className='mb-4'>
                            <p>Nome: {item.nome}</p>
                            <p>Preço do Item: R${item.preco.toFixed(2)}</p>
                            <p>Quantidade: {item.quantidade}</p>
                            <p>Observação: {item.observacao}</p>
                            <p>Adicional por unidade: {item.adicional_por_un}</p>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 border border-gray-400">R${pedido.total.toFixed(2)}</td>
                    <td className="p-2 border border-gray-400">
                      <button
                        onClick={() => handleExcluirPedido(pedido.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => handleFinalizarPedido(pedido.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                      >
                        Finalizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 justify-center flex">
            <button onClick={fetchPedidos} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Atualizar pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
