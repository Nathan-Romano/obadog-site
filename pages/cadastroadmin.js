import { useState } from "react"
import { setCookie } from "cookies-next"
import { useRouter } from "next/router"
import Input from "../src/components/Input"
import Button from "../src/components/Button"
import { getCookie } from "cookies-next"
import { verifica } from "../services/user"

export default function CadastroAdminPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [error, setError] = useState('')
    const router = useRouter()

    const handleFormEdit = (event, username) =>  {
        setFormData({
            ...formData, 
            [username]: event.target.value
        })
    };

    const handleForm = async (event) => {
        try {
            event.preventDefault();
            const response = await fetch(`/api/admin/cadastroadmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            
            const json = await response.json()
            if (response.status !== 201) throw new Error(json)

            setCookie('authorization', json)

        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Cadastro Admin
                        </h1>
                        <form onSubmit={handleForm} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu usuário</label>
                                <Input type="name" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="joaosilva" required value={formData.username} onChange={(e) => handleFormEdit(e, "username")} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                                <Input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={formData.password} onChange={(e) => handleFormEdit(e, "password")} />
                            </div>
                            <Button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Cadastrar</Button>
                            {error && <p className="w-full text-white bg-primary-600 font-medium text-sm px-5 py-2.5 text-center">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    try {
        const token = getCookie('authorization', { req, res })
        if(!token) throw new Error('Token Invalido')
        console.log(token)

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