import { getCookie } from "cookies-next"
import { verifica } from "../services/user"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from "../src/components/Form"
import Grid from "../src/components/Grid"


export default function PageDashboard() {

    const { register, handleSubmit, setValue, reset } = useForm()
    const [error, setError] = useState('')
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [updateList, setUpdateList] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [editingProductId, setEditingProductId] = useState(null)
    const [editingMode, setEditingMode] = useState(false)
    const formRef = useRef(null)

    const handleForm = async (event) => {
        try {
            const response = await fetch('/api/produtos/createproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            })
            console.log(event)
            const json = await response.json()
            if (response.status !== 200) throw new Error(json)

            reset();
            setEditingProductId(null);
            formRef.current.scrollIntoView()

            //setCookie('authorization', json)
            //router.push('/dashboard')
            setUpdateList(true);
            toast.success('Produto cadastrado com sucesso!');

        } catch (error) {
            //setError(error.message)
            toast.error('Ocorreu um erro ao cadastrar o produto.');
        }

    }

    const handleUpdate = async (event) => {
        try {
            const response = await fetch(`/api/produtos/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            })
            const json = await response.json()
            if (response.status !== 200) throw new Error(json)

            setEditingProductId(null);
            setEditingMode(false);
            formRef.current.scrollIntoView()
            setUpdateList(true);
            toast.success('Produto atualizado com sucesso!');
            reset();
        } catch (error) {
            setError(error.message)
            console.log(error.message)
            toast.error('Ocorreu um erro ao atualizar o produto.');
        }
    }

    const handleEdit = (product) => {
        setValue("foto", product.foto);
        setValue("nome", product.nome);
        setValue("preco", product.preco);
        setValue("categoria", product.categoria);
        setValue("descricao", product.descricao);
        setEditingProductId(product.id);
        setEditingMode(true);
        formRef.current.scrollIntoView();
    }

    async function fetchProducts() {
        try {
            const res = await fetch('/api/produtos/getproduct', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            setProducts(data);
            setUpdateList(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteProduct(id) {
        try {
            const res = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            toast.success('Produto excluido com sucesso!');
            setUpdateList(true);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Ocorreu um erro ao excluir o produto.');
        }
    }
    useEffect(() => {
        fetchProducts();
    }, [updateList]);

    return (
            <section className="bg-white dark:bg-gray-900 lg:py-8">
                <div className="py-8 px-4 mx-auto max-w-3xl lg:py-8 p-4 dark:bg-gray-800 shadow-sm rounded-lg w-full">
                    <Form handleForm={handleForm} handleUpdate={handleUpdate} reset={reset} editingProductId={editingProductId} formRef={formRef} handleSubmit={handleSubmit} register={register}/>
                </div>
                <Grid products={products} handleUpdate={handleUpdate} setProducts={setProducts} setUpdateList={setUpdateList} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} handleEdit={handleEdit} deleteProduct={deleteProduct} />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </section>
    )
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

