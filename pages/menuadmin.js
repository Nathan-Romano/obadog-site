import Sidebar from "../src/components/Sidebar";
import Adicionais from "../src/components/Adicionais";
import Bairros from "../src/components/Bairros";
import HomePage from "../src/components/Home"
import React, { useState } from 'react';
import PageDashboard from "./dashboard";
import CadastroAdminPage from "./cadastroadmin";
import Pedidos from "../src/components/Pedidos"
import { getCookie } from "cookies-next"
import { verifica } from "../services/user"

export default function menuAdmin() {
    const [selectedItem, setSelectedItem] = useState("Home");
    const handleProdutosClick = (produto) => {
        setSelectedItem (produto)
    };

    return (
        <div className="flex w-screen h-screen flex-grow">
            <Sidebar onProdutoClick={handleProdutosClick} />
            <div className="flex-grow overflow-y-auto w-screen h-screen">
                {selectedItem === "Home" ? <HomePage /> : ""}
                {selectedItem === "Produtos" ? <PageDashboard /> : ""}
                {selectedItem === "Pedidos" ? <Pedidos /> : ""}
                {selectedItem === "Cadastrar" ? <CadastroAdminPage /> : ""}
                {selectedItem === "Adicionais" ? <Adicionais /> : ""}
                {selectedItem === "Bairros" ? <Bairros /> : ""}
            </div>
            
        </div>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    try {
        const token = getCookie('authorization', { req, res })
        if (!token) throw new Error('Token Invalido')
        verifica(token)
        return {
            props: {

            }
        }
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/login'
            },
            props: {

            }
        }
    }
};


