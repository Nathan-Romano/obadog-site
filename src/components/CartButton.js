import React, { useContext, useEffect, useState } from "react";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { CartContext } from "./CartContext";
import { Cart } from "./Cart"
var CryptoJS = require("crypto");

export const CartButton = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const [modalOpen, setModalOpen] = useState(false);

    // <button className="fixed bottom-4 right-4 bg-red-500 rounded-full p-2 shadow-lg z-50">
    //   <div className="flex items-center justify-center text-white">
    //     <IconShoppingCart className="w-6 h-6" />
    //     {cartItems.length > 0 && (
    //       <span className="ml-1 text-sm font-semibold">
    //         ({cartItems.length})
    //       </span>
    //     )}
    //   </div>
    // </button>

    useEffect(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
            // Se houver dados salvos no localStorage, atualize o carrinho com esses dados
            setCartItems(JSON.parse(storedCartItems));
        }
    }, [setCartItems]);

    const toggleModal = () => {
        if (cartItems.length === 0) {
            setModalOpen(false);
        } else {
            setModalOpen((prevModalOpen) => !prevModalOpen);
        }
    };

    return (
        <div>
            {cartItems.length > 0 && (
                <button
                    className="fixed bottom-4 right-4 bg-red-500 rounded-full p-2 shadow-lg z-50 hover:bg-red-600"
                    onClick={toggleModal}
                >
                    <div className="flex items-center justify-center text-white">
                        <IconShoppingCart className="w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="ml-1 text-sm font-semibold">
                                ({cartItems.length})
                            </span>
                        )}
                    </div>
                </button>
            )}
            {modalOpen && (
                <div className="fixed top-0 left-0 bottom-0 right-0 backdrop-filter backdrop-blur-sm z-50">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-4 bg-amber-50 rounded-lg shadow-md text-red-500 max-w-md font-sans items-center align-middle">
                        <button
                            className="absolute top-2 p-2 right-2 text-amber-50 cursor-pointer font-black shadow-2xl bg-zinc-800 bg-opacity-60 rounded-lg "
                            onClick={toggleModal}
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                        {/* Render the cart items */}
                        <Cart setModalOpen={setModalOpen} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartButton;
