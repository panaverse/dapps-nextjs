import type { NextPage } from 'next';
import { useState, useEffect } from "react";
import Metamask from "../component/Metamask";
import { ethers } from "ethers";
import { getKovanSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs

interface ClientStatus{
  isConnected: boolean;
  address?: string;
  balance?: string;
  ethBalance?: string;
}


const Index: NextPage = () => {

  const [haveMetamask, sethaveMetamask] = useState<boolean>(true);

  const [clientStatus, setClientStatus] = useState<ClientStatus>({
    isConnected: false,
  });
  const [transferData, setTransferData] = useState({
    address: "",
    amount: 0
  })

  let provider: ethers.providers.Web3Provider;

  const checkConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      sethaveMetamask(true);
      
      const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
      const {chainId} = await new ethers.providers.Web3Provider((window as any).ethereum).getNetwork();
      console.log("chainId: ", chainId);

      if(chainId !== 42){
        alert("Please switch to Kovan testnet")
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
    console.log("updateBalance: Begin");
    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const defaultSigner = ethers.Wallet.createRandom().connect(provider)
    const sdk = getKovanSdk(defaultSigner) // default signer will be wired with all contract instances

    const balance: ethers.BigNumber = await sdk.ziaCoin.balanceOf(account);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    console.log("updateBalance: Balance: " + balance);

    const ethBalance = await provider.getBalance(account);
    const ethBalanceFormated: string = ethers.utils.formatEther(ethBalance);

    setClientStatus({
      isConnected: true,
      address: account,
      balance: balanceFormated,
      ethBalance: ethBalanceFormated
    });

    console.log("Balance" + clientStatus.balance);

  };

  const mint = async () => {
    console.log("Minting Begin");

    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const sdk = getKovanSdk(signer) // default signer will be wired with all contract instances
    const tx = await sdk.ziaCoin.mint(clientStatus.address!, ethers.utils.parseEther("10"));
    await tx.wait(1);

    // const tx = await sdk.ziaCoin. ['trasfer(address,uint256)'](userEOA, cTokens)
    // await tx.wait(1);

  
    const balance: ethers.BigNumber = await sdk.ziaCoin.balanceOf(clientStatus.address!);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    setClientStatus((e) => ({...e, balance: balanceFormated}));

  }

  const handleInput = async (data: string, type: "address"|"amount") => {
    if(type === "address"){
      setTransferData((e) => ({...e, address: data}))
    }
    else if (type === "amount"){
      const amount = Number(data)
      setTransferData((e) => ({...e, amount }))
    }

  }

  const handleTransfer = async () => {
    
    // validate inputs
    const isValidAddress = ethers.utils.isAddress(transferData.address);
    if (!isValidAddress) {
      alert("Not a valid address")
      throw ("")
    }
    const currentBalance = Number(clientStatus.balance!);
    if (transferData.amount > currentBalance) {
      alert("Not enough Balance to transfer")
      throw ("")
    }

    console.log("Transfer Begin");

    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const sdk = getKovanSdk(signer) // default signer will be wired with all contract instances

    const tx = await sdk.ziaCoin.transfer(transferData.address, ethers.utils.parseEther(transferData.amount.toString()));
    await tx.wait(1);

    const balance: ethers.BigNumber = await sdk.ziaCoin.balanceOf(clientStatus.address!);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    setClientStatus((e) => ({...e, balance: balanceFormated}));

  }


  useEffect(() => {
    checkConnection();
  }, []);


  return (
    <>
      <section className="container d-flex">
        <main>
          <h1 className="main-title">Let's learn how to write to a contract with eth-sdk </h1>

          <div>
            {!haveMetamask ? (
              <Metamask />
            ) : clientStatus.isConnected ? (
              <div style={{margin: "10px"}}> 
                <br />
                <h2>You're connected ✅</h2>
                <div>My Metamask Account: {clientStatus?.address}</div>
                <div>My ETH Balance: {clientStatus?.ethBalance}</div>
                <div>My Zia Coin Balance: {clientStatus?.balance}</div>
                <a href='https://faucets.chain.link/' target="_blank" style={{textDecoration: "underline"}}> Get Kovan faucet eths </a>

                <br /><br />

                <div>
                  <button onClick={mint}>Mint 10 Zia Coins</button>
                </div>


                <br /><br />

                <div>
                  <div >Transfer Zia Coins to your another wallet</div>
                  <label>Address: </label>
                  <input type="text" value={transferData.address} onChange={(e) => handleInput(e.target.value, "address")} style={{width: "500px"}}/>
                  <br />
                  <label>Amount: </label>
                  <input type="number" value={transferData.amount} onChange={(e) => handleInput(e.target.value, "amount")} style={{width: "200px"}}/>
                  <br />

                  <button onClick={handleTransfer} >Transfer</button>

                </div>
              
              
              </div>
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
