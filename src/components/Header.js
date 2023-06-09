import React, { useEffect, useState } from "react";
import { IconCreditCard, IconClockHour3, IconInfoCircle, IconX } from "@tabler/icons-react"
import Maps from "./Maps"


import Visa from "../components/Visa"
import MasterCard from "../components/MasterCard"
import Elo from "../components/Elo"
import Hipercard from "../components/Hipercard"

export default function Header({ selectedCategory, setSelectedCategory }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedModal, setSelectedModal] = useState(null);
    const [openState, setOpenState] = useState()
    const [handleEntrega, setHandleEntrega] = useState()
    const [handleRetirada, setHandleRetirada] = useState()


    async function fetchState() {
        try {
            const res = await fetch('/api/operacao/getestado', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            const estado = data[0]?.estado;
            setOpenState(estado)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchState();
        fetchEspera()
    }, []);

    async function fetchEspera() {
        try {
            const res = await fetch('/api/espera/getespera', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            const entrega = data[0]?.entrega;
            const retirada = data[0]?.retirada
            setHandleEntrega(entrega)
            setHandleRetirada(retirada)
        } catch (error) {
            console.error(error);
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <header className="justify-center sticky top-0">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 text-center tracking-wide">OBADOG</h2>
            <p className="mb-4 text-l text-zinc-900 text-center">
                <a target="_blank" href="https://maps.google.com/?q=Av Santa Catarina, 1250, Floresta, Joinville" className="text-gray-900 underline font-normal">Av Santa Catarina, 1250 - Floresta - Joinville</a>
            </p>
            <div className="flex justify-evenly px-36">
                <div className="flex flex-col items-center">
                    <p className="text-l  text-zinc-900 text-center">Delivery</p>
                    <p className="text-l font-thin text-zinc-900 text-center">{handleEntrega} min.</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-l  text-zinc-900 text-center">Retirada</p>
                    <p className="text-l font-thin text-zinc-900 text-center">{handleRetirada} min.</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between px-16">
                <div className="flex flex-col items-center">
                    <p className="text-l  text-zinc-900 text-center cursor-pointer hover:text-red-500" onClick={() => { setModalOpen(true); setSelectedModal("pagamento"); }}>Pagamento</p>
                    <IconCreditCard className="text-zinc-900" />
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-l  text-zinc-900 text-center cursor-pointer hover:text-red-500 " onClick={() => { setModalOpen(true); setSelectedModal("horarios"); }}>Horários</p>
                    <IconClockHour3 className="text-zinc-900" />
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-l text-zinc-900 text-center cursor-pointer hover:text-red-500 " onClick={() => { setModalOpen(true); setSelectedModal("info"); }}>Informações</p>
                    <IconInfoCircle className="text-zinc-900" />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h2 className="mt-4 text-xl font-semibold text-zinc-900">Operação</h2>
                <p className={`mt-1 text-l ${openState === 'ABERTO' ? 'text-green-600' : 'text-red-500'} tracking-widest font-medium`} >{openState && openState}</p>
            </div>
            <nav className=" flex justify-between bg-amber-50 pt-2 px-2 rounded-lg " >
                <button className={`tracking-widest flex-1 h-12 hover:border-b-2 focus:border-b-2 focus:text-red-500 border-red-500 hover:border-red-500 text-sm bg-amber-50 min-w-fit px-4 py-2 text-gray-900
            ${selectedCategory === 'hotdogs' ? 'font-bold text-red-500 focus:border-b-2 focus:text-red-500 border-red-500 border-b-2' : ''}`} onClick={() => setSelectedCategory('hotdogs')}>HOTDOGS
                </button>
                <button className={`tracking-widest flex-1 h-12 hover:border-b-2 focus:border-b-2 focus:text-red-500 border-red-500 hover:border-red-500 text-sm bg-amber-50 min-w-fit px-4 py-2 text-gray-900
            ${selectedCategory === 'smash' ? 'font-bold text-red-500 focus:border-b-2 focus:text-red-500 border-red-500 border-b-2' : ''}`} onClick={() => setSelectedCategory('smash')}>SMASH
                </button>
                <button className={`tracking-widest flex-1 h-12 hover:border-b-2 focus:border-b-2 focus:text-red-500 border-red-500 hover:border-red-500 text-sm bg-amber-50 min-w-fit px-4 py-2 text-gray-900
            ${selectedCategory === 'bebidas' ? 'font-bold text-red-500 focus:border-b-2 focus:text-red-500 border-red-500 border-b-2' : ''}`} onClick={() => setSelectedCategory('bebidas')}>BEBIDAS
                </button>
            </nav>
            {modalOpen && (
                <div className="fixed top-0 left-0 bottom-0 right-0 backdrop-filter backdrop-blur-sm z-50">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-4 bg-amber-50 rounded-lg shadow-md text-red-500 max-w-md font-sans items-center align-middle">
                        {selectedModal === "pagamento" ?
                            < div className="px-10 py-4">
                                <h2 className="text-zinc-900 text-2xl mb-4 text-center">Pagamento</h2>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="flex  items-center">
                                        <Visa /><p className="text-lg text-gray-900 ml-6">Visa</p>
                                    </div>
                                    <div className="flex  items-center">
                                        <MasterCard /><p className="text-lg text-gray-900 ml-6">MasterCard</p>
                                    </div>
                                    <div className="flex  items-center">
                                        <Elo /><p className="text-lg text-gray-900 ml-6">Elo</p>
                                    </div>
                                    <div className="flex  items-center">
                                        <Hipercard /><p className="text-lg text-gray-900 ml-6">Hipercard</p>
                                    </div>

                                </div>
                                <button
                                    className="absolute top-2 p-2 right-2 text-amber-50 cursor-pointer font-black shadow-2xl bg-zinc-800 bg-opacity-60 rounded-lg " onClick={() => handleCloseModal()}>
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                            : ""}
                        {selectedModal === "horarios" ?
                            < div className="px-10 py-4">
                                <h2 className="text-zinc-900 text-2xl mb-4 text-center">Horarios</h2>
                                <ul className="text-gray-900 space-y-2">
                                    <li>
                                        <span className="font-semibold">Segunda-feira:</span> 19:30hrs às 23:30hrs
                                    </li>
                                    <li>
                                        <span className="font-semibold">Terça-feira:</span> 19:30hrs às 23:30hrs
                                    </li>
                                    <li>
                                        <span className="font-semibold">Quarta-feira:</span> 19:30hrs às 23:30hrs
                                    </li>
                                    <li>
                                        <span className="font-semibold">Quinta-feira:</span> 19:30hrs às 23:30hrs
                                    </li>
                                    <li>
                                        <span className="font-semibold">Sexta-feira:</span> 19:30hrs às 23:30hrs
                                    </li>
                                    <li>
                                        <span className="font-semibold">Sábado:</span> 19:30hrs às 23:30hrs
                                    </li>
                                </ul>
                                <button
                                    className="absolute top-2 p-2 right-2 text-amber-50 cursor-pointer font-black shadow-2xl bg-zinc-800 bg-opacity-60 rounded-lg " onClick={() => handleCloseModal()}>
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                            : ""}
                        {selectedModal === "info" ?
                            < div className="px-10 py-4">
                                <h2 className="text-zinc-900 text-2xl mb-4 text-center text-">Informações</h2>
                                <p className="font-bold text-gray-900">
                                    Endereço: <a target="_blank" href="https://maps.google.com/?q=Av Santa Catarina, 1250, Floresta, Joinville" className="text-gray-900 underline font-normal">Av Santa Catarina, 1250 - Floresta - Joinville</a>
                                </p>
                                <p className="font-bold text-gray-900">
                                    Telefone: <a href="https://wa.me/5547984801287" className="text-gray-900 underline font-normal">+55 47 98480-1287 (WhatsApp)</a>
                                </p>
                                <div className="flex justify-center items-center mt-4">
                                    <Maps />
                                </div>
                                <button
                                    className="absolute top-2 p-2 right-2 text-amber-50 cursor-pointer font-black shadow-2xl bg-zinc-800 bg-opacity-60 rounded-lg " onClick={() => handleCloseModal()}>
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                            : ""}
                    </div>
                </div>
            )}

        </header >

    )
}
