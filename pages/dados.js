import { IconChevronLeft } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
var CryptoJS = require("crypto-js");
require('dotenv').config();

import InputMask from 'react-input-mask';


export default function DadosPage() {
  const router = useRouter();
  const [selectedBairro, setSelectedBairro] = useState("");
  const [dados, setDados] = useState({
    bairros: "",
    endereco: "",
    numero: "",
    complemento: "",
    nome: "",
    telefone: "",
    referencia: "",
  });
  const [bairros, setBairros] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bairroSelecionado = bairros.find((bairro) => bairro.nome === selectedBairro);
    if (bairroSelecionado) {
      const dadosEntrega = {
        ...dados,
        bairros: selectedBairro,
        taxaEntrega: bairroSelecionado.taxa,
      }
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dadosEntrega), process.env.NEXT_PUBLIC_STORAGE).toString();
      localStorage.setItem('dadosEntrega', encryptedData);
      // Lógica para enviar os dados do endereço para onde for necessário
    }
    router.push("/pedido")
  };

  const handleChange = (e) => {
    setDados(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeBairro = (e) => {
    setSelectedBairro(e.target.value);
  };

  async function fetchBairros() {
    try {
      const res = await fetch('/api/bairros/getbairro', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      setBairros(data);
      console.log(data);
      // Handle the error or set a default value for bairros
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBairros();
  }, []);
  return (
    <div className="bg-amber-50 w-full h-screen pt-2">
      <div className="container mx-auto px-8 py-4 pt-2 m-auto max-w-3xl bg-amber-50 w-full border border-gray-300  rounded-xl shadow-xl items-center">
        <div className='w-full items-center flex text-center py-4 gap-4'>
          <Link href='/' className='text-amber-50 rounded-full bg-red-500 p-1 shadow-md shadow-red-300' ><IconChevronLeft /></Link>
          <h1 className="text-2xl font-bold text-gray-900 text-center ">Dados de Entrega</h1>
        </div>
        <form onSubmit={handleSubmit} className='w-full'>

          <div className="flex gap-4 items-center py-2">

            <select
              id="bairro"
              name="bairros"
              onChange={handleChangeBairro}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
              required
            >
              <option value="">Selecione um bairro</option>
              {bairros?.map((bairro) => (
                <option key={bairro.id} value={bairro.nome}>{bairro.nome} (R$ {bairro.taxa.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <div className=" gap-4  w-full items-center">
            <label className="text-gray-900">Endereço:</label>
            <input
              type="text"
              name='endereco'
              id="endereco"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
              required
            />
          </div>

          <div className=" gap-4  w-full items-center">
            <label className="text-gray-900">Numero:</label>
            <input
              type="number"
              name='numero'
              id="numero"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
              required
            />
          </div>

          <div className=" gap-4  w-full items-center">
            <label className="text-gray-900">Complemento:</label>
            <input
              type="complemento"
              name='complemento'
              id="complemento"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
              required
            />
          </div>

          <div className=" gap-4  w-full items-center">
            <label className="text-gray-900">Nome:</label>
            <input
              type="nome"
              name='nome'
              id="nome"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
              required
            />
          </div>

          <div className=" gap-4 w-full items-center">
            <label className="text-gray-900">Telefone:</label>
            <InputMask
              mask="(99) 9 9999-9999"
              type="text"
              name="telefone"
              id="telefone"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
            />
          </div>

          <div className=" gap-4  w-full items-center">
            <label className="text-gray-900">Referencia:</label>
            <input
              type="referencia"
              name='referencia'
              id="referencia"
              onChange={handleChange}
              className="text-gray-900 border border-gray-300 px-2 py-1 rounded w-full"
            />
          </div>
          <div className=" justify-center mt-4 flex">
            <button  type="submit" className="text-white bg-red-500 rounded-full shadow-md shadow-red-300 px-4 py-2">
              Proximo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
