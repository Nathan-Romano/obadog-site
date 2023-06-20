import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../src/components/CartContext';
import { IconCurrencyReal, IconX, IconMinus, IconPlus, IconChevronLeft } from "@tabler/icons-react";
import Link from 'next/link';
import { useRouter } from 'next/router';
var CryptoJS = require("crypto-js");
import { v4 as uuidv4 } from 'uuid';
const moment = require('moment');

require('dotenv').config();


export default function PedidoPage() {
    const { cartItems, setCartItems, isDelivery, clearCart } = useContext(CartContext);
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [taxaEntrega, setTaxaEntrega] = useState(0);
    const [status, setStatus] = useState(0);
    const [observacao, setObservacao] = useState('');
    const [telefone, setTelefone] = useState('');
    const [numero, setNumero] = useState('');
    const [bairros, setBairros] = useState('');
    const [nome, setNome] = useState('');
    const [tempoRetirada, setTempoRetirada] = useState('')
    const [tempoEntrega, setTempoEntrega] = useState('')
    const [quantity, setQuantity] = useState(1);
    const [formaPagamento, setFormaPagamento] = useState('');
    const [troco, setTroco] = useState(0);
    const [precisaTroco, setPrecisaTroco] = useState(0);
    const router = useRouter()

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
            setTempoRetirada(retirada)
            setTempoEntrega(entrega)
        } catch (error) {
            console.error(error);
        }
    }

    function generateIdentifier() {
        // Gera um UUID v4
        const uuid = uuidv4();

        // Extrai os 4 últimos dígitos do UUID
        const lastFourDigits = uuid.slice(-4);

        // Retorna os 4 últimos dígitos como identificador
        return lastFourDigits;
    }

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }

        const dadosEntrega = localStorage.getItem('dadosEntrega');
        if (dadosEntrega) {
            const bytes = CryptoJS.AES.decrypt(dadosEntrega, process.env.NEXT_PUBLIC_STORAGE);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            //console.log(decryptedData)
            const { endereco, taxaEntrega, numero, bairros, complemento, nome_cliente, telefone } = decryptedData;
            setEndereco(endereco);
            setTaxaEntrega(taxaEntrega);
            setNumero(numero)
            setBairros(bairros)
            setComplemento(complemento);
            setNome(nome_cliente);
            setTelefone(telefone)
        }
    }, []);

    useEffect(() => {
        // Sempre que o carrinho for atualizado, salve os dados no localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [setCartItems]);

    useEffect(() => {
        fetchEspera();

    }, [])


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

    const decreaseQuantity = (itemId) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.cartItemId === itemId) {
                const updatedItem = { ...item };
                if (updatedItem.quantity > 1) {
                    updatedItem.quantity -= 1;
                    setQuantity(updatedItem)
                }
                return updatedItem;
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const increaseQuantity = (itemId) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.cartItemId === itemId) {
                const updatedItem = { ...item };
                updatedItem.quantity += 1;
                setQuantity(updatedItem)
                return updatedItem;
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const removeItem = (itemId) => {
        const updatedCartItems = cartItems.filter((item) => item.cartItemId !== itemId);
        setCartItems(updatedCartItems);
    };

    const handleFormaPagamentoChange = (event) => {
        setFormaPagamento(event.target.value);
    };

    const handleTrocoChange = (event) => {
        setTroco(parseFloat(event.target.value));
    };

    const handlePrecisaTrocoChange = (event) => {
        setPrecisaTroco(event.target.value === 'sim');
    };

    const handlePedidoFinalizado = async () => {
        createPedidoResumo();
        clearCart();
        localStorage.removeItem('cartItems');
        localStorage.removeItem('dadosEntrega');
        router.push('/pedidofinalizado')
    }


    const createPedidoResumo = async () => {
        //const timestamp = new Date().toISOString();
        const timestamp = moment().format('DD/MM/YYYY - HH:mm:ss');
        const pedidoId = generateIdentifier();
        let message = "RESUMO DO PEDIDO\n";
        //console.log(timestamp);
        message += "Status do pedido: " + (status === 0 ? "Preparando" : "") + "\n";
        message += "Horario do pedido: " + timestamp + "\n\n";
        message += "ITENS DO CARRINHO\n";
        cartItems.forEach((item) => {
            message += "Nome: " + item.name + "\n";
            message += "Preço do item: R$" + (item.price * item.quantity).toFixed(2) + "\n";
            message += "Quantidade: " + item.quantity + "\n";
            message += "Observação: " + (item.observacao ? item.observacao : "Não Informado") + "\n";
            message += "Adicional por un.: " + (item.additionalIngredients.length > 0 ? item.additionalIngredients.join(", ") : "Não selecionado") + "\n\n";
        });
        message += "DADOS DE ENTREGA\n";
        (isDelivery ? (message += "Nome: " + nome + "\n") : (''));
        (isDelivery ? (message += "Telefone: " + telefone + "\n") : (''));
        message += "Endereço: " + (endereco ? (endereco + ", " + numero + " - " + bairros) : "Pedido para retirada") + "\n";
        (isDelivery ? (message += "Complemento: " + (complemento ? complemento : "Não foi informado") + "\n") : (""))
        message += "Forma de Pagamento: " + formaPagamento + "\n";
        if (formaPagamento === 'dinheiro') {
            if (precisaTroco) {
                message += "Precisa de Troco: Sim\n";
                message += "Troco para: " + troco.toFixed(2) + "\n";
            } else {
                message += "Precisa de Troco: Não\n";
            }
        }
        if (isDelivery) {
            message += "Entrega: " + tempoEntrega + "min\n";
            message += "Taxa: " + taxaEntrega.toFixed(2) + "\n"
            message += "TOTAL: R$" + (calculateTotalPrice() + taxaEntrega).toFixed(2);
        } else {
            message += "Pedido ID: (Informe na hora de retirar): " + pedidoId + "\n";
            message += "Retirada: " + tempoRetirada + "min\n";
            message += "TOTAL: R$" + calculateTotalPrice().toFixed(2) + "\n\n";
        }

        // Send the message via WhatsApp
        const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER // Replace with the desired phone number
        //console.log('numero', phoneNumber)
        const url = "https://api.whatsapp.com/send?phone=" + phoneNumber + "&text=" + encodeURIComponent(message);
        window.open(url, "_blank");

        const data = {
            nome: nome ? nome : "",
            telefone: telefone ? telefone : "",
            endereco: endereco ? (endereco + ", " + numero + " - " + bairros + " - " + complemento) : "Pedido para retirada",
            bairros: bairros ? bairros : "",
            numero: numero ? numero : "",
            status: status,
            complemento: complemento ? complemento : "Não foi informado",
            forma_pagamento: formaPagamento,
            precisa_troco: precisaTroco,
            valor_troco: precisaTroco ? troco.toFixed(2) : 0,
            tempo_min: isDelivery ? tempoEntrega : tempoRetirada,
            taxa_entrega: isDelivery ? taxaEntrega.toFixed(2) : 0,
            total: isDelivery ? (calculateTotalPrice() + taxaEntrega).toFixed(2) : calculateTotalPrice().toFixed(2),
            horario_pedido: timestamp,
            itens: cartItems.map(item => ({
                nome: item.name,
                preco: (item.price * item.quantity).toFixed(2),
                quantidade: item.quantity,
                observacao: item.observacao ? item.observacao : "Não Informado",
                adicional_por_un: item.additionalIngredients.length > 0 ? item.additionalIngredients.join(", ") : "Não selecionado"
            }))
        };
        //console.log(data)

        try {
            const response = await fetch('api/pedido/addpedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

        } catch (error) {
            console.error('Ocorreu um erro ao cadastrar o pedido:', error);
        }

        // console.log("Resumo do Pedido:");
        // console.log("Itens do Carrinho:");
        // cartItems.forEach((item) => {
        //     console.log("  Nome: ", item.name);
        //     console.log("  Preço: R$", (item.price * item.quantity).toFixed(2));
        //     console.log("  Quantidade: ", item.quantity);
        //     console.log("  Observação: ", item.observacao ? item.observacao : "Não Informado");
        //     console.log("  Adicional por un.: ", item.additionalIngredients.length > 0 ? item.additionalIngredients.join(", ") : "Não selecionado");
        //     console.log("  Total: ", calculateTotalPrice())
        // });

        // console.log("Endereço: ", endereco ? (endereco, ", ", numero, " - ", bairros) : "Pedido para retirada");
        // console.log("Forma de Pagamento: ", formaPagamento);
        // if (formaPagamento === 'dinheiro') {
        //     if (precisaTroco) {
        //         console.log("Precisa de Troco: Sim");
        //         console.log("Valor do Troco: ", troco.toFixed(2));
        //       } else {
        //         console.log("Precisa de Troco: Não");
        //       }
        // }
        // if (isDelivery) {
        //     console.log("Entrega: ", tempoEntrega, "min");
        // } else {
        //     console.log("Retirada: ", tempoRetirada, "min");
        // }
    };

    return (
        <div className='bg-amber-50 w-full h-screen pt-2'>
            <div className="container mx-auto px-8 py-8 pt-2 m-auto max-w-3xl bg-amber-50 w-full border border-gray-300  rounded-xl shadow-xl items-center">
                <div className='w-full items-center flex text-center py-4 gap-4'>
                    <Link href='/' className='text-amber-50 rounded-full bg-red-500 p-1 shadow-md shadow-red-300' onClick={() => {
                        localStorage.removeItem("cartItems")
                        clearCart()
                    }}><IconChevronLeft /></Link>
                    <h1 className="text-2xl font-bold text-gray-900 text-center ">Carrinho de pedidos</h1>
                </div>

                {cartItems.length > 0 ? (
                    <div>
                        {cartItems.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="flex items-center justify-between py-4 border-b border-gray-200"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={item.foto}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg mr-4"
                                    />
                                    <div>
                                        <h3 className="text-lg text-gray-900 font-semibold">{item.name}</h3>
                                        <p className="text-gray-400">R${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-gray-400">Adicional por un.: {item.additionalIngredients.length > 0 ? item.additionalIngredients.join(", ") : "Não selecionado"}</p>
                                        <p className="text-gray-400">Observação: {item.observacao ? <p>Observação: {item.observacao}</p> : "Não Informado"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => decreaseQuantity(item.cartItemId)}
                                        className="mr-2 text-amber-50 bg-red-500 rounded-lg px-1 py-1 shadow-md shadow-red-300 hover:bg-red-600"
                                    >
                                        <IconMinus className="w-4 h-4" />
                                    </button>
                                    <p className="text-gray-600">{item.quantity}</p>
                                    <button
                                        onClick={() => increaseQuantity(item.cartItemId)}
                                        className="ml-2 text-amber-50 bg-green-500 rounded-lg px-1 py-1 shadow-md shadow-green-300 hover:bg-green-600"
                                    >
                                        <IconPlus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.cartItemId)}
                                        className="ml-4 text-gray-600 p-1"
                                    >
                                        <IconX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">Seu carrinho está vazio.</p>
                )}

                {cartItems.length > 0 && (
                    <div className="mt-8">
                        {isDelivery ? (
                            <div>
                                <div className="flex justify-between py-2">
                                    <p className="text-gray-600">Subtotal:</p>
                                    <p className="text-gray-900">
                                        <IconCurrencyReal className="inline-block w-4 h-4 mr-1 text-red-500" />
                                        {calculateTotalPrice().toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <p className="text-gray-600">Taxa de Entrega:</p>
                                    <p className="text-gray-900">
                                        <IconCurrencyReal className="inline-block w-4 h-4 mr-1 text-red-500" />
                                        {taxaEntrega.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <p className="text-gray-600">Endereço:</p>
                                    <p className="text-gray-900">{endereco}, {numero} - {bairros}</p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <p className="text-gray-600">Entrega:</p>
                                    <p className="text-gray-900">{tempoEntrega} min.</p>
                                </div>
                            </div>
                        ) : (<div>
                            <div className="flex justify-between py-2">
                                <p className="text-gray-600">Retirada:</p>
                                <p className="text-gray-900">{tempoRetirada} min.</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p className="text-gray-600">Endereço:</p>
                                <a target="_blank" href="https://maps.google.com/?q=Av Santa Catarina, 1250, Floresta, Joinville" className="text-gray-950 underline font-normal">Av Santa Catarina, 1250 - Floresta - Joinville</a>
                            </div>
                        </div>
                        )}
                        <div className="flex justify-between py-2">
                            <p className="text-lg font-semibold text-gray-900">Total:</p>
                            {isDelivery ? (
                                <p className="text-lg font-semibold text-gray-900">
                                    <IconCurrencyReal className="inline-block w-4 h-4 mr-1 text-red-500" />
                                    {(calculateTotalPrice() + taxaEntrega).toFixed(2)}
                                </p>
                            ) : (<p className="text-lg font-semibold text-gray-900">
                                <IconCurrencyReal className="inline-block w-4 h-4 mr-1 text-red-500" />
                                {(calculateTotalPrice()).toFixed(2)}
                            </p>
                            )}
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Forma de Pagamento</h2>
                            <div className="flex items-center">
                                <label htmlFor="formaPagamentoCartao" className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        id="formaPagamentoCartao"
                                        name="formaPagamento"
                                        value="cartao"
                                        checked={formaPagamento === 'cartao'}
                                        onChange={handleFormaPagamentoChange}
                                        className="mr-2"
                                    />
                                    <span className='text-gray-900'>Pagamento com Cartão (Elo, Mastercard, Visa, Hipercard)</span>
                                </label>
                            </div>
                            <div className="flex items-center ">
                                <label htmlFor="formaPagamentoDinheiro" className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        id="formaPagamentoDinheiro"
                                        name="formaPagamento"
                                        value="dinheiro"
                                        checked={formaPagamento === 'dinheiro'}
                                        onChange={handleFormaPagamentoChange}
                                        className="mr-2"
                                    />
                                    <span className='text-gray-900'>Pagamento em Dinheiro</span>
                                </label>
                            </div>
                            {formaPagamento === 'dinheiro' && (
                                <div className='flex flex-col'>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center text-gray-900">Precisa de Troco?</label>
                                        <div className="flex items-center ">
                                            <label htmlFor="precisaTrocoSim" className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    id="precisaTrocoSim"
                                                    name="precisaTroco"
                                                    value="sim"
                                                    checked={precisaTroco}
                                                    onChange={handlePrecisaTrocoChange}
                                                    className="w-5 h-5 mr-2"
                                                />
                                                <span className='text-gray-900'>Sim</span>
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label htmlFor="precisaTrocoNao" className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    id="precisaTrocoNao"
                                                    name="precisaTroco"
                                                    value="nao"
                                                    checked={!precisaTroco}
                                                    onChange={handlePrecisaTrocoChange}
                                                    className="w-5 h-5 mr-2"
                                                />
                                                <span className='text-gray-900'>Não</span>
                                            </label>
                                        </div>
                                    </div>
                                    {precisaTroco && (
                                        <div className="flex items-center">
                                            <label htmlFor="troco" className="text-gray-900 mr-2">
                                                Troco para quanto?
                                            </label>
                                            <input
                                                type="number"
                                                id="troco"
                                                onChange={handleTrocoChange}
                                                className="text-gray-900 border border-gray-300 px-2 py-1 rounded"
                                                required
                                                placeholder='50'
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className='flex text-center w-full'>
                                <button className=" text-white bg-green-500 rounded-lg px-4 py-2 shadow-md shadow-green-300 hover:bg-green-600"
                                    onClick={handlePedidoFinalizado}>Finalizar Pedido</button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div >
    );
}
