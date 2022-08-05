import type { NextPage } from 'next';
import { useState, useEffect } from "react";
import { signMessage } from "../utils/sign";
import Link from "next/link";
import Metamask from "../component/Metamask";
import { ethers } from "ethers";
import { FormControl, FormLabel, Button, Input } from '@chakra-ui/react';

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

  const [address, setAddress] = useState<string>('');

  const [amount, setAmount] = useState<string>("");

  let provider: ethers.providers.Web3Provider;

  const checkConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      sethaveMetamask(true);
      provider = new ethers.providers.Web3Provider((window as any).ethereum);
      console.log("Provider set in checkConnection: " + provider);
      const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
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

    console.log("Provider at end of checkConnection: " + provider);
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

    console.log("Provider at the end of connectWeb3: " + provider);
  };

  const updateBalance = async(account: string) => {
    console.log("updateBalance: Begin");
    console.log("Provider at beginning of updateBalance: " + provider);
    const balance: ethers.BigNumber = await provider.getBalance(account);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    console.log("updateBalance: Balance: " + balance);
    setClientStatus({
      isConnected: true,
      address: account,
      balance: balanceFormated
    });

    //console.log("Balance" + clientStatus.balance);

  };

  const sendEther = async() => {
    console.log("send ether called");
    console.log("Provider at start of sendEther: " + provider);
    console.log("haveMetamask: " + haveMetamask);
    const signer = provider.getSigner();
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(amount)
    });

  }


  useEffect(() => {
    checkConnection();
  }, []);


  return (
    <>
      <section className="container d-flex">
        <main>
          <h1 className="main-title">Awesome DApp</h1>

          <div>
            {!haveMetamask ? (
              <Metamask />
            ) : clientStatus.isConnected ? (
              <>
                <br />
                <h2>You're connected ✅</h2>
                <div>My Metamask Account:</div>
                <div>{clientStatus?.address}</div>
                <div>You have Georli Ether:</div>
                <div>{clientStatus?.balance}</div>
                <br />
                
                <div>
                  <div>
                  <FormControl isRequired>
                    <FormLabel>Receiver's Address</FormLabel>
                    <Input placeholder='address' width="2xl" onChange={event => setAddress(event.currentTarget.value)} />
                  </FormControl>
                  </div>
                  <div>
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input placeholder='0.0' width="30" onChange={event => setAmount(event.currentTarget.value)}/>
                  </FormControl>
                  </div>
                  <Button onClick={sendEther}>Send Ether</Button>
                </div>
                 
              
                
              </>
            ) : (
              <>
                <br />
                <Button onClick={connectWeb3}>
                  Connect Wallet
                </Button>
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
