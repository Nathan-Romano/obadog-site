import React, { createContext, useState } from "react";

// Cria o contexto do carrinho de compras
export const CartContext = createContext();

// Componente do contexto do carrinho de compras
export const CartProvider = ({ children }) => {
  // Estado do carrinho de compras
  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);

  // Função para adicionar um item ao carrinho
  const addItemToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  // Função para remover um item do carrinho
  const removeItemFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    setCartItems([]);
    setModalOpen(false);
  };

  const hasItems = cartItems.length > 0;

  // Valor do contexto do carrinho de compras
  const cartContextValue = {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    setCartItems,
    clearCart,
    hasItems,
    modalOpen,
    setModalOpen,
    isDelivery, // Adiciona a opção isDelivery ao valor do contexto
    setIsDelivery, 
  };

  // Renderiza o provedor do contexto com os componentes filhos
  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
