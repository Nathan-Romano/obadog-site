import { useForm } from "react-hook-form";
import Button from "./Button";
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ handleForm, handleUpdate, reset, editingProductId, formRef, handleSubmit:handleFormSubmit, register }) => {

    const onSubmit = (data) => {
        if (editingProductId) {
          handleUpdate(data);
        } else {
          handleForm(data);
        }
      };

    return (
        <div className="py-8 px-4 mx-auto max-w-3xl lg:py-8 p-4 dark:bg-gray-800 shadow-sm rounded-lg w-full">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center">Adicione um novo produto</h2>
            <form ref={formRef} onSubmit={editingProductId ? handleFormSubmit(handleUpdate) : handleFormSubmit(handleForm)}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Foto</label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text" {...register("foto")} id="foto" placeholder="Link da foto do produto" required />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text" {...register("nome")} id="name" placeholder="Informe o produto" required />
                    </div>
                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Preço</label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="number" {...register("preco")} id="price" placeholder="R$ 23,00" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                        <select defaultValue="hotdogs" {...register("categoria")} id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required  >
                            <option value="hotdogs">Hotdogs</option>
                            <option value="smash">Smash</option>
                            <option value="bebidas">Bebidas</option>
                            <option value="indisponivel">Indisponível</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" id="description" {...register("descricao")} placeholder="Descreva o produto" required />
                    </div>
                </div>
                <Button type="submit" className="w-full flex items-center justify-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    {editingProductId ? 'Atualizar Produto' : 'Adicionar Produto'}
                </Button>
            </form>
        </div>
    );
};

export default Form;
