import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export default function HomeDashboardPage() {
  const [openState, setOpenState] = useState(0)
  const [handleEntrega, setHandleEntrega] = useState('')
  const [handleRetirada, setHandleRetirada] = useState('')


  // useEffect(() => {
  //   const checkOpeningStatus = () => {
  //     const currentHour = new Date().getHours();
  //     if (currentHour >= 19.40 && currentHour < 23.30) {
  //       setOperationStatus('ABERTO');
  //     } else {
  //       setOperationStatus('FECHADO');
  //     }
  //   };

  //   checkOpeningStatus();
  //   const interval = setInterval(checkOpeningStatus, 60000); // Atualiza a cada minuto

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

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
      setOpenState(estado)
      //console.log(estado)
    } catch (error) {
      console.error(error);
    }
  }

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
      setHandleEntrega(entrega)
      setHandleRetirada(retirada)
      //console.log(entrega)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchState();
    fetchEspera();
  }, []);

  async function updateState() {
    try {
      const newEstado = openState === 'ABERTO' ? 'FECHADO' : 'ABERTO';
      const res = await fetch('/api/operacao/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newEstado })
      });
      const data = await res.json();
      setOpenState(data.estado);
      toast.success('Informação atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Houve um problema ao atualizar a informação!');
    }
  }

  async function updateEspera() {
    try {
      const res = await fetch('/api/espera/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entrega: handleEntrega, retirada: handleRetirada })
      });
      toast.success('Tempo atualizado com sucesso!');
      const data = await res.json();
    } catch (error) {
      console.error(error);
      toast.error('Houve um problema ao atualizar o tempo!');
    }
  }

  return (
    <div className='bg-gray-900 h-full w-full flex justify-center items-center flex-col'>
      <ul className='bg-gray-800 px-4 py-4 rounded-lg'>
        <div className='text-center py-4'>HOME
          <div className='flex justify-between gap-5 items-center px-8'>
            <li className='whitespace-nowrap'>Operação:</li>
            <label>{openState}</label>
            <button className="mb-6 w-full flex items-center justify-center px-5 py-2.5 mt-6 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800" onClick={updateState} >{openState === 'FECHADO' ? 'Abrir' : 'Fechar'}</button>
          </div>
          <div className='flex flex-col justify-between gap-5 items-center px-8 w-full'>
            <div className='flex w-full items-center justify-between'>
              <li className='whitespace-nowrap'>Tempo entrega:</li>
              <input className="bg-gray-50 w-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={handleEntrega}
                onChange={(e) => setHandleEntrega(e.target.value)} required />
            </div>
            <div className='flex w-full items-center justify-between'>
              <li className='whitespace-nowrap'>Tempo retirada:</li>
              <input className="bg-gray-50 w-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={handleRetirada}
                onChange={(e) => setHandleRetirada(e.target.value)} required/>
            </div>
          </div>
          <div className='flex justify-between gap-5 items-center px-8'>
            <button className="mb-6 w-full flex items-center justify-center px-5 py-2.5 mt-6 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
              onClick={updateEspera}>Atualizar</button>
          </div>
        </div>
      </ul>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>

  )
}

