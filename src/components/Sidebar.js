import React, { useEffect, useState } from "react"
import { User, List, ShoppingCart, Layers, Map, X } from "react-feather";



export default function Sidebar({ onProdutoClick }) {
    const [isSidebarFixed, setIsSidebarFixed] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleProdutoClick = (produto) => {
        if (onProdutoClick) {
            onProdutoClick(produto);
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarFixed(window.innerWidth < 640);
            if (window.innerWidth >= 640) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <div className="bg-gray-900">
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button"
                className="z-50 inline-flex items-center p-4 mt-2 m-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={handleMenuToggle}
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>

            <aside id="default-sidebar" className={`${isSidebarFixed ? "fixed top-0 left-0" : ""
                }
                     bg-gray-800 z-40 h-full w-64 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 overflow-y-auto`} aria-label="Sidebar">
                {isSidebarFixed ? (
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-white text-lg font-semibold">Sidebar</h2>
                        <button
                            className="text-white focus:outline-none"
                            onClick={handleMenuToggle}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>) : ""}
                <ul className="pt-6 space-y-2 font-medium">
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Home")}
                    >
                        <div className="flex items-center">
                            <ShoppingCart size={20} className="mr-2" />
                            Home
                        </div>
                    </li>
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Pedidos")}
                    >
                        <div className="flex items-center">
                            <ShoppingCart size={20} className="mr-2" />
                            Pedidos
                        </div>
                    </li>
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Produtos")}
                    >
                        <div className="flex items-center">
                            <List size={20} className="mr-2" />
                            Produtos
                        </div>
                    </li>
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Cadastrar")}
                    >
                        <div className="flex items-center">
                            <User size={20} className="mr-2" />
                            Cadastrar usuário
                        </div>
                    </li>
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Adicionais")}
                    >
                        <div className="flex items-center">
                            <Layers size={20} className="mr-2" />
                            Adicionais
                        </div>
                    </li>
                    <li className="flex items-center p-6 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleProdutoClick("Bairros")}
                    >
                        <div className="flex items-center">
                            <Map size={20} className="mr-2" />
                            Bairros
                        </div>
                    </li>
                </ul>
            </aside>
        </div>
    );

};


