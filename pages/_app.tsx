import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from "../src/components/CartContext"
import CartButton from '@/src/components/CartButton'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <CartButton />
    </CartProvider>
  )
}
