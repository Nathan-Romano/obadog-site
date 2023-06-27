import React from 'react'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="pt-2 flex flex-col bg-amber-50 w-full h-screen justify-center items-center">
      <Image
        className="text-center justify-center rounded-lg w-full h-auto"
        src="/scooby.gif"
        alt="Scooby"
        width={300}
        height={300}
        priority={true}
      />
      <p className="text-gray-950 font-semibold text-lg">Carregando...</p>
    </div>
  )
}
