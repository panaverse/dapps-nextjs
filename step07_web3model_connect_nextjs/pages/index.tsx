import type { NextPage } from 'next'
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useState } from 'react';

let web3Modal: Web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { 42: process.env.NEXT_PUBLIC_RPC_URL }, // required
    },
  },
};

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, // required
  });
}

interface User {
  isConnected: boolean;
  signer?: ethers.providers.JsonRpcSigner;
  address?: string;
}

const Home: NextPage = () => {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [user, setUser] = useState<User>({
    isConnected: false
  });

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        // setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUser({isConnected:true, signer, address});
        

      } catch (e) {
        console.log(e);
      }
    } else {
      setUser({isConnected: false});
    }
  }

  const disconnect = async () => {
    await web3Modal.clearCachedProvider()
    setUser({isConnected: false});
  }


  return (
    <div>

      <h1>web3modal Library is Awesome</h1>

      {
        hasMetamask ? (
          user.isConnected ? (
            <>
              Connected with address: {user?.address} <br />
              <button onClick={() => disconnect()} > Disconnect </button>
            </>
          ) : (
            <button onClick={() => connect()}>Connect</button>
          )
        ) : (
          "Please install metamask"
        )
      }

    </div>
  )
}

export default Home
