import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Grid = ({ products, setUpdateList, selectedCategory, setSelectedCategory, handleEdit, deleteProduct, setProducts, handleUpdate }) => {
    const [category, setCategory] = useState('');
    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch('/api/produtos/getproduct', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            //console.log(data)
            setProducts(data);
            setUpdateList(false)
        } catch (error) {
            console.error(error);
        }
    }

    // Agrupar produtos por categoria
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.categoria;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    const handleHideProduct = async (product) => {
        try {
          const updatedProduct = { ...product, categoria: "indisponivel" };

          const response = await fetch(`/api/produtos/${product.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
          });
      
          const json = await response.json();
          if (response.status !== 200) throw new Error(json);
      
          toast.success('Produto escondido com sucesso!');
          setUpdateList(true);
        } catch (error) {
          console.error(error);
          toast.error('Ocorreu um erro ao esconder o produto.');
        }
      };
      


    // Filtrar produtos da categoria selecionada
    const filteredProducts = selectedCategory === 'Todos' ? products : groupedProducts[selectedCategory];


    return (
        <div className="mx-auto max-w-3xl pt-16 ">
            <h2 className=" text-xl font-bold text-gray-900 dark:text-white dark:bg-gray-800 text-center rounded-t-lg pt-4">Produtos</h2>
            <nav className="flex justify-center items-center py-4 dark:bg-gray-800 px-4 rounded-b-lg mb-4">
                <button className={`hover:bg-blue-800 focus:outline-none  focus:bg-blue-900 text-sm font-medium bg-primary-700 rounded-l px-4 py-2 text-gray-900 dark:text-white ${selectedCategory === 'Todos' ? 'font-bold' : ''}`} onClick={() => setSelectedCategory('Todos')}>
                    Todos
                </button>
                <button className={`hover:bg-blue-800 focus:outline-none  focus:bg-blue-900 text-sm font-medium bg-primary-700  px-4 py-2 text-gray-900 dark:text-white ${selectedCategory === 'hotdogs' ? 'font-bold' : ''}`} onClick={() => setSelectedCategory('hotdogs')}>
                    Hotdogs
                </button>
                <button className={`hover:bg-blue-800 focus:outline-none  focus:bg-blue-900 text-sm font-medium bg-primary-700  px-4 py-2 text-gray-900 dark:text-white ${selectedCategory === 'smash' ? 'font-bold' : ''}`} onClick={() => setSelectedCategory('smash')}>
                    Smash
                </button>
                <button className={`hover:bg-blue-800 focus:outline-none  focus:bg-blue-900 text-sm font-medium bg-primary-700  px-4 py-2 text-gray-900 dark:text-white ${selectedCategory === 'indisponivel' ? 'font-bold' : ''}`} onClick={() => setSelectedCategory('indisponivel')}>
                    Indisponiveis
                </button>
                <button className={`hover:bg-blue-800 focus:outline-none focus:bg-blue-900 text-sm font-medium bg-primary-700 rounded-r px-4 py-2 text-gray-900 dark:text-white ${selectedCategory === 'bebidas' ? 'font-bold' : ''}`} onClick={() => setSelectedCategory('bebidas')}>
                    Bebidas
                </button>
            </nav>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto font-varela">

                {filteredProducts && filteredProducts.map((product, index) => {
                    return (
                        <div className="flex flex-col bg-white dark:bg-gray-800 mx-auto lg:py-2 p-2 shadow-sm rounded-lg w-full justify-between h-full" key={index}>
                            <img src={product.foto} alt={product.nome} className="h-52 w-full object-cover rounded-lg rounded-b-none mb-4" />
                            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">{product.nome}</h2>
                            <p className="text-gray-700 dark:text-gray-300 p-6 text-justify">{product.descricao}</p>
                            <div className="flex justify-between align-bottom mt-auto">
                                <span className="flex text-sm font-black text-gray-900 dark:text-white px-4 py-2">R$ {product.preco.toFixed(2)}</span>
                                <span className="flex text-sm font-black text-gray-900 dark:text-white px-4 py-2">{product.categoria}</span>
                            </div>
                            <div className="flex justify-between align-bottom">
                                <button className="text-sm font-medium text-white bg-primary-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 mt-auto"
                                    onClick={() => handleEdit(product)}>Editar</button>
                                    {selectedCategory !== 'indisponivel' ? 
                                    <button type="submit" className="text-sm font-medium text-white bg-primary-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 mt-auto"
                                    onClick={() => handleHideProduct(product)}>Esconder</button>: ''}
                                <button className="text-sm font-medium text-white bg-primary-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 mt-auto"
                                    onClick={() => deleteProduct(product.id)}>Excluir</button>
                            </div>
                        </div>
                    )
                })}
            </div>
            
        </div>
    );
};

export default Grid;
