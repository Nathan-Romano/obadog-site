import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify";

export default function Bairros() {
    const [bairros, setBairros] = useState([]);
    const [editingBairroId, setEditingBairroId] = useState(null)
    const [editingMode, setEditingMode] = useState(false)
    const [updateList, setUpdateList] = useState(false)
    const formRef = useRef(null)
    const { register, handleSubmit, setValue, reset } = useForm()

    async function fetchBairros() {
        try {
            const res = await fetch('/api/bairros/getbairro', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            //console.log(data)
            setBairros(data)
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        fetchBairros();
    }, [updateList]);

    async function createBairro(event) {
        try {
            const response = await fetch('/api/bairros/createbairro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            })
            //console.log(event)
            const json = await response.json()
            if (response.status !== 200) throw new Error(json)

            
            setEditingBairroId(null);
            formRef.current.scrollIntoView()

            //setCookie('authorization', json)
            //router.push('/dashboard')
            setUpdateList(true);
            toast.success('Bairro cadastrado com sucesso!');
            reset();
            fetchBairros()

        } catch (error) {
            console.log(error.message)
            toast.error('Ocorreu um erro ao cadastrar o Bairro.');
        }

    }


    const handleUpdate = async (event) => {
        try {
            const response = await fetch(`/api/bairros/${editingBairroId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            })
            const json = await response.json()
            if (response.status !== 200) throw new Error(json)

            setEditingBairroId(null);
            setEditingMode(false);
            formRef.current.scrollIntoView()
            setUpdateList(true);
            toast.success('Bairro atualizado com sucesso!');
            reset();
            fetchBairros()
        } catch (error) {
            setError(error.message)
            console.log(error.message)
            toast.error('Ocorreu um erro ao atualizar o Bairro.');
        }
    }

    const handleEdit = (bairro) => {
        setValue("nome", bairro.nome);
        setValue("taxa", bairro.taxa);
        setEditingBairroId(bairro.id);
        setEditingMode(true);
        formRef.current.scrollIntoView();
    }

    async function deleteBairro(id) {
        try {
            const res = await fetch(`/api/bairros/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            toast.success('Bairro excluido com sucesso!');
            setUpdateList(true);
            fetchBairros();
        } catch (error) {
            console.error(error);
            toast.error('Ocorreu um erro ao excluir o Bairro.');
        }
    }



    return (
        <div className="bg-gray-900 h-full w-full flex justify-center items-center">
            <div className="max-w-3xl w-full bg-gray-800 shadow-sm rounded-lg p-5">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center">Cadastro Bairros</h2>
                <form ref={formRef} onSubmit={editingBairroId ? handleSubmit(handleUpdate) : handleSubmit(createBairro)}>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Bairro
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Taxa
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border rounded-sm dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <input id="nome" type="text" name="nome" {...register("nome")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Digite aqui o adicional para cadastrar" required />
                                </td>
                                <td className="px-6 py-4">
                                    <input id="taxa" type="text" name="taxa" {...register("taxa")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Digite aqui o adicional para cadastrar" required />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit" className="mb-6 w-full flex items-center justify-center px-5 py-2.5 mt-6 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                     >{editingBairroId ? 'Atualizar item' : 'Adicionar item'}</button>
                </form>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Bairro
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Taxa
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ação
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bairros.map((bairro, index) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {bairro.nome}
                                    </th>
                                    <td className="px-6 py-4">
                                        R$ {bairro.taxa.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 flex-col">
                                        <button onClick={() => handleEdit(bairro)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</button>
                                        <button onClick={() => deleteBairro(bairro.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Excluir</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    )
}