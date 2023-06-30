import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from "../src/components/CartContext"
import CartButton from '@/src/components/CartButton'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Head>
      <title>Obadog - Prensados Gourmet</title>
      </Head>
      <Component {...pageProps} />
      <CartButton />
    </CartProvider>
  )
}
