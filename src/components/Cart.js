import React, { useContext, useEffect } from "react";
import { CartContext } from "./CartContext"; // Importe o CartContext
import { IconCurrencyReal } from "@tabler/icons-react";
import { useRouter } from "next/router";
var CryptoJS = require("crypto-js");

export const Cart = ({ setModalOpen }) => {
    const router = useRouter()
    const { cartItems, setCartItems, clearCart, hasItems, isDelivery, setIsDelivery } = useContext(CartContext);

    const handleDeliveryOptionChange = (event) => {
        setIsDelivery(event.target.value === "delivery");
    };

    const handleFinishOrder = () => {
        isDelivery ? (router.push("/dados")
        ) : (
            router.push("/pedido"),
            localStorage.removeItem("dadosEntrega")
            )
        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
            // Se houver dados salvos no localStorage, atualize o carrinho com esses dados
            setCartItems(JSON.parse(storedCartItems));
        }
        setModalOpen(false)
    }

    useEffect(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
            // Se houver dados salvos no localStorage, atualize o carrinho com esses dados
            setCartItems(JSON.parse(storedCartItems));
        }
    }, [setCartItems]);

    useEffect(() => {
        // Sempre que o carrinho for atualizado, salve os dados no localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const handleClearCart = () => {
        clearCart();
        setModalOpen(false);
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cartItems.forEach((item) => {
            const itemTotalPrice = item.price * item.quantity; // Usa o valor individual do item
            const additionalIngredientsTotal = item.additionalIngredientsPrice.reduce(
                (total, ingredient) => total + ingredient * item.quantity,
                0
            );
            //console.log(itemTotalPrice, additionalIngredientsTotal);
            totalPrice += itemTotalPrice + additionalIngredientsTotal; //
        });
        return totalPrice;
    };

    
    return (
        <div className="px-8 py-4 h-[350px] overflow-y-auto w-full">
            <h2 className="text-zinc-900 text-2xl mb-4">Meu Carrinho</h2>
            <div>
                <h2 className=" text-gray-900 font-semibold pt-2 pb-2">Seu pedido é para:</h2>
                <div className="flex gap-4 pb-4">
                    <div className="flex gap-2">
                        <label className="text-gray-900">
                            <input
                                className=""
                                type="radio"
                                value="delivery"
                                checked={isDelivery}
                                onChange={handleDeliveryOptionChange}
                            />
                             Entrega
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <label className="pl-2 text-gray-900 ">
                            <input
                                className=""
                                type="radio"
                                value="pickup"
                                checked={!isDelivery}
                                onChange={handleDeliveryOptionChange}
                            />
                             Retirada
                        </label>
                    </div>
                </div>
            </div>

            {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center mb-6 text-zinc-400">
                    <img
                        src={item.foto}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                    <div>
                        <p className="font-bold text-zinc-900">{item.name}</p>
                        <p>Quantidade: {item.quantity}</p>
                        {item.category !== "bebidas" && (
                            <p>Adicionais: {item.additionalIngredients.length > 0 ? item.additionalIngredients.join(", ") : "Nenhum"}</p>
                        )}
                        {item.observacao ? <p>Observação: {item.observacao}</p> : ""}
                        <p>Preço: R${item.price.toFixed(2)}</p>
                    </div>
                </div>

            ))}
            <p className="flex mb-6 text-xl">Total: <IconCurrencyReal className="text-red-500 pt-2" />{calculateTotalPrice().toFixed(2)}</p>
            <div className="flex justify-between items-center gap-2">
                {cartItems.length > 0 && hasItems && (
                    <button className=" text-amber-50 flex bg-red-500 rounded-lg px-7 py-3 shadow-md shadow-red-300 hover:bg-red-600 margin-auto"
                        onClick={handleClearCart}>Limpar carrinho</button>
                )}
                <button className=" text-amber-50 flex bg-red-500 rounded-lg px-7 py-3 shadow-md shadow-red-300 hover:bg-red-600 margin-auto"
                    onClick={() => handleFinishOrder()}>Finalizar pedido</button>
            </div>
        </div>

    );
};
export default Cart;