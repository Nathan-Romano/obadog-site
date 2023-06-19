import React, { useState, useContext, useEffect } from "react";
import { IconCurrencyReal, IconX, IconMinus, IconPlus } from "@tabler/icons-react";
import { CartContext } from "./CartContext";
import { v4 as uuidv4 } from 'uuid';

export default function Modal({ isOpen, setModalOpen, selectedProductModal }) {
  const [quantity, setQuantity] = useState(1);
  const [additionalIngredients, setAdditionalIngredients] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [adds, setAdds] = useState (null)
  
  async function fetchAdds() {
    try {
      const res = await fetch('/api/adicionais/getadd', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAdds();
      setAdds(data);
    };
  
    fetchData();
  }, []);


  // Obtenha a função addItemToCart do contexto do carrinho de compras
  const { addItemToCart } = useContext(CartContext);

  const calculateTotalPrice = () => {
    const basePrice = selectedProductModal.preco * quantity;
    const additionalIngredientsPrices = additionalIngredients.reduce(
      (total, ingredient) => total + ingredient.preco,
      0
    );
    //console.log(additionalIngredientsPrices)
    //console.log(basePrice);
    return basePrice + additionalIngredientsPrices * quantity;
  };

  const handleAddToCart = () => {
    // Crie o objeto do item com as informações necessárias
    const item = {
      cartItemId: uuidv4(), // Gera um ID único para o item
      foto: selectedProductModal.foto,
      id: selectedProductModal.id,
      name: selectedProductModal.nome,
      category: selectedProductModal.categoria,
      quantity: quantity,
      additionalIngredients: additionalIngredients.map((ingredient) => ingredient.nome + ' (R$ '+ ingredient.preco.toFixed(2) +')'),
      additionalIngredientsPrice: additionalIngredients.map((ingredient) => ingredient.preco),
      price: selectedProductModal.preco,
      priceTotal: calculateTotalPrice(), // Use a função calculateTotalPrice para obter o preço total do item
      observacao: observacao.trim() !== "" ? observacao : null,
    };

    // Adicione o item ao carrinho de compras
    addItemToCart(item);
    localStorage.setItem('cartItems', JSON.stringify(item))
    // Feche o modal (opcional)
    setModalOpen(false);
    setQuantity(1);
    setAdditionalIngredients([]);
    setObservacao("");
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIngredientChange = (ingredient) => {

      const ingredientIndex = additionalIngredients.findIndex((item) => item.id === ingredient.id);

      if (ingredientIndex !== -1) {
        // Ingredient already selected, remove it
        const updatedIngredients = [...additionalIngredients];
        updatedIngredients.splice(ingredientIndex, 1);
        setAdditionalIngredients( updatedIngredients);
      } else {
        // Ingredient not selected, add it
        setAdditionalIngredients([...additionalIngredients, ingredient]);
      }
    };
    
  if (isOpen && selectedProductModal) {

    return (
      <div className="fixed top-0 left-0 bottom-0 right-0 backdrop-filter backdrop-blur-sm z-50 border border-gray-300">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-4 bg-amber-50 rounded-lg 
        shadow-md text-red-500 max-w-md font-sans items-center align-middle max-h-[700px] min-h-[350px] overflow-y-auto ">
          <button
            className="absolute top-2 p-2 right-2 text-amber-50 cursor-pointer font-black shadow-2xl bg-zinc-800 bg-opacity-60 rounded-lg"
            onClick={setModalOpen}
          ><IconX className="w-4 h-4" />
          </button>
          <img
            src={selectedProductModal.foto}
            alt={selectedProductModal.nome}
            className="object-cover rounded-lg rounded-b-none mb-8 w-full h-80 min-w-[360px]"
          />
          <div className="flex justify-between px-8">
            <h2 className="mb-2 text-2xl font-bold text-zinc-900">{selectedProductModal.nome}</h2>
            <div className="flex items-center">
              <button className="text-amber-50 bg-red-500 rounded-lg px-1 py-1 shadow-md shadow-red-300 hover:bg-red-600" onClick={decrementQuantity}>
                <IconMinus className="w-4 h-4" />
              </button>
              <span className="mx-3 text-lg font-bold">{quantity}</span>
              <button className="text-amber-50 bg-red-500 rounded-lg px-1 py-1 shadow-md shadow-red-300 hover:bg-red-600" onClick={incrementQuantity}>
                <IconPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mb-3 text-zinc-400 px-8">{selectedProductModal.descricao}</p>
          {selectedProductModal.categoria !== "bebidas" && (
            <div className="px-8 ">
              <h2 className="mb-3 text-xl font-bold text-zinc-900">Observação</h2>
              <textarea value={observacao} placeholder="Informe ingredientes para retirar." className="resize-none w-full mb-3 text-zinc-400 px-4 py-2 border-zinc-200 shadow-md border-1 rounded-xl"
                onChange={(e) => setObservacao(e.target.value)}></textarea>
            </div>)}
          {selectedProductModal.categoria !== "bebidas" && (
            <div className="flex flex-wrap px-8 mb-2">
              {adds && adds.map((ingredient) => (
                <label key={ingredient.nome} className="flex text-zinc-400 items-center mr-3 mb-1">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={additionalIngredients.some((item) => item.id === ingredient.id)}
                    onChange={() => handleIngredientChange(ingredient)}
                  />
                  {ingredient.nome} (+R$ {ingredient.preco.toFixed(2)})
                </label>
              ))}
            </div>
          )}
          <div className="mb-3 flex justify-between items-center px-8">
            <div className="items-start">
              <p className="flex flex-col text-gray-500 justify-center items-center text-sm" >Preço</p>
              <p className="flex text-red-500 text-lg" ><IconCurrencyReal className="text-red-500 pt-2" />{calculateTotalPrice()}</p>
            </div>

            <button className=" text-amber-50 flex justify-between items-center bg-red-500 rounded-lg px-7 py-3 shadow-md shadow-red-300 hover:bg-red-600" 
            onClick={handleAddToCart} >Adicionar ao carrinho</button>
          </div>
        </div>
      </div >
    );
  } else {
    return null;
  }
}
