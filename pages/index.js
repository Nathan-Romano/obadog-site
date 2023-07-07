import { IconShoppingCart, IconCurrencyReal } from "@tabler/icons-react";
import { useState, useEffect } from "react"
import Modal from "../src/components/Modal"
import Header from "../src/components/Header";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Home({ products }) {
  const [products, setProducts] = useState([])
  const [updateList, setUpdateList] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('hotdogs')
  const [operationStatus, setOperationStatus] = useState('')
  const [isOpen, setIsOpen] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [msgClosed, setMessageClosed] = useState(false)


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
      setOperationStatus(estado)
      //console.log(estado)
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/produtos/getproduct', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        //body: JSON.stringify(response)
      })
      const data = await res.json();
      //console.log(data)
      setProducts(data);
      setUpdateList(false);
    } catch (error) {
      console.error(error);
    } 
  }
  useEffect(() => {

   // console.log(products)
    fetchProducts();
    fetchState();
  }, [updateList]);


const handleAddtoCart = (product) => {
  if (operationStatus === "FECHADO") {
    setMessageClosed(true);
    toast.error('Não é possível fazer pedido com a loja fechada.')
  } else {
    setSelectedProduct(product);
    setOpenModal(true);
  }
};
const handleCloseMessage = () => {
  setMessageClosed(false);
};

  // Agrupar produtos por categoria
  const groupedProducts = products && products?.reduce((acc, product) => {
    const category = product.categoria;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Filtrar produtos da categoria selecionada
  const filteredProducts = selectedCategory === 'hotdogs' ? groupedProducts['hotdogs'] : groupedProducts[selectedCategory];

  return (
    <section className="bg-amber-50 font-['system-ui'] min-h-screen">
      <div className="pt-2 m-auto max-w-3xl bg-amber-50 w-full rounded-xl shadow-xl">
        <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mx-auto py-4 font-varela">
        {filteredProducts && filteredProducts.map((product, index) => {
          //console.log(product)Não é possivel fazer pedido com a loja fechada. Por favor, verifique nosso horario de atendimento.
          return (
            <div className="flex flex-col bg-amber-50 mx-auto shadow-xl rounded-3xl w-full justify-between hover:border-red-500 border-transparent border-b-2" key={index}>
              <img src={product.foto} alt={product.nome} className={`h-60 w-full object-cover rounded-t-3xl rounded-b-none mb-2 ${selectedCategory === 'bebidas' ? 'object-scale-down bg-white' : ''} `} />
              <h2 className="text-xl font-medium text-gray-900 px-4">{product.nome}</h2>
              <p className="text-gray-500 px-4 pt-2 line-clamp-1 mb-2 font-varela">{product.descricao}</p>
              <div className="flex justify-between items-center mt-auto pb-4">
                <p className="flex text-red-500 text-xl px-4" ><IconCurrencyReal className="text-red-500 pt-1" />{product.preco}</p>
                <button className=" bg-red-500 hover:bg-red-600 rounded-full mr-4 p-1 shadow-md shadow-red-300"
                  onClick={() => {
                    fetchState()
                    //console.log(operationStatus)
                    handleAddtoCart(product)
                    //setOpenModal(true)
                  }}>
                  <IconShoppingCart className=" text-amber-50 p-1" />
                </button>

              </div>
              <Modal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)} selectedProductModal={selectedProduct} />
            </div>
          )
        })}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </section>
  )
}

// export async function getStaticProps() {

//   // await new Promise((resolve) => setTimeout(resolve, 1000)); 
// //http://localhost:3000/api/produtos/getproduct
// //https://obadog.com.br/api/produtos/getproduct
//   const resP = await fetch('https://www.obadog.com.br/api/produtos/getproduct', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   })

//   const products = await resP.json()
//   return {
//     props: {
//       products,
//     },
//     revalidate: 3600
//   }
// }




