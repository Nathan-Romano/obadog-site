import { IconChevronLeft } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

export default function pedidoFinalizado() {
  
    return (
        <div className="bg-amber-50 w-full h-screen pt-2">
        <div className="container mx-auto px-8 py-8 pt-2 m-auto max-w-3xl bg-amber-50 w-full border border-gray-300 rounded-xl shadow-xl items-center">
          <div className="w-full flex items-center justify-between">
            <Link href="/" className="text-amber-50 rounded-full bg-red-500 p-1 shadow-md shadow-red-300">
              <IconChevronLeft />
            </Link>
            <div className="flex flex-col gap-4 justify-center text-center items-center">
              <h1 className="text-2xl font-bold text-gray-900 text-center mt-8">Pedido Finalizado</h1>
              <h2 className="text-xl text-gray-900 text-center">Obrigado por comprar com a Obadog. Ficamos felizes em atendê-lo!</h2>
              <button>teste</button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    )
}
