import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";

const getLibrary = (provider: ExternalProvider) => {
  return new Web3Provider(provider);
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  )
}

export default MyApp
