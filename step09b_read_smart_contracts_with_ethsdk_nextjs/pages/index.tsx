import type { NextPage } from 'next';
import { useState, useEffect } from "react";
import Metamask from "../component/Metamask";
import { ethers } from "ethers";
import { getGoerliSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs

interface ClientStatus{
  isConnected: boolean;
  address?: string;
  balance?: string;
}


const Index: NextPage = () => {

  const [haveMetamask, sethaveMetamask] = useState<boolean>(true);

  const [clientStatus, setClientStatus] = useState<ClientStatus>({
    isConnected: false,
  });

  let provider: ethers.providers.Web3Provider;

  const checkConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      sethaveMetamask(true);
      
      const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
      const {chainId} = await new ethers.providers.Web3Provider((window as any).ethereum).getNetwork();
      console.log("chainId: ", chainId);

      if(chainId !== 5){
        alert("Please switch to Goerli testnet")
        throw("NETWORK CHAIN ERROR")
      }

      if (accounts.length > 0) {
        await updateBalance(accounts[0]);
      } else {
        setClientStatus({
          isConnected: false,
        });
      }

    } else {
      sethaveMetamask(false);
    }
  };


  const connectWeb3 = async () => {
    //console.log("In ConnectWeb3: Start");
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      
      const accounts: string[] = await ethereum.request({method: "eth_requestAccounts"});


      console.log("In ConnectWeb3: After")
      
      await updateBalance(accounts[0]);

    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const updateBalance = async(account: string) => {
    // console.log("updateBalance: Begin");
    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const defaultSigner = ethers.Wallet.createRandom().connect(provider)
    const sdk = getGoerliSdk(defaultSigner) // default signer will be wired with all contract instances
    const balance: ethers.BigNumber = await sdk.dai.balanceOf(account);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    console.log("updateBalance: Balance: " + balance);
    setClientStatus({
      isConnected: true,
      address: account,
      balance: balanceFormated
    });

    console.log("Balance" + clientStatus.balance);

  };


  useEffect(() => {
    checkConnection();
  }, []);


  return (
    <>
      <section className="container d-flex">
        <main>
          <h1 className="main-title">Let's learn how to Read from a contract with eth-sdk</h1>

          <div>
            {!haveMetamask ? (
              <Metamask />
            ) : clientStatus.isConnected ? (
              <>
                <br />
                <h2>You're connected ✅</h2>
                <div>My Metamask Account:</div>
                <div>{clientStatus?.address}</div>
                <div>My DAI Balance:</div>
                <div>{clientStatus?.balance}</div>
              </>
            ) : (
              <>
                <br />
                <button className="btn connect-btn" onClick={connectWeb3}>
                  Connect Wallet
                </button>
              </>
            )}
          </div>
          {/* ---- */}
        </main>
      </section>
    </>
  );
};

export default Index;
