import type { NextPage } from 'next';
import { useState, useEffect } from "react";
import Metamask from "../component/Metamask";
import { ethers } from "ethers";

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

  // Note: We need event in this ABI 
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function mint(address, uint256)",
    "function transfer(address, uint256) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

  let contract: ethers.Contract;

  const checkConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      sethaveMetamask(true);
      const providerx = new ethers.providers.Web3Provider((window as any).ethereum);
      const {chainId} = await providerx.getNetwork();

      if(chainId !== 42){
        alert("Please switch to Kovan testnet")
        throw("NETWORK CHAIN ERROR")
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
    // if (provider) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const address: string = '0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f'; // https://kovan.etherscan.io/address/0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f
      contract = new ethers.Contract(address, ERC20_ABI, provider);
      const balance: ethers.BigNumber = await contract.balanceOf(account);
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
    // }

    console.log("Balance" + clientStatus.balance);

  };

  const mint = async () => {
    console.log("Minting Begin");

    // provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const address: string = '0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f'; // https://kovan.etherscan.io/address/0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f
    const signer = provider.getSigner()
    contract = new ethers.Contract(address, ERC20_ABI, provider);

    const tx = await contract.connect(signer).mint(clientStatus.address, ethers.utils.parseEther("10"));
    await tx.wait(1);

    const balance: ethers.BigNumber = await contract.balanceOf(clientStatus.address);
    const balanceFormated: string = ethers.utils.formatEther(balance);
    setClientStatus((e) => ({ ...e, balance: balanceFormated }));


  }

  useEffect(() => {
    checkConnection();
  }, []);


  interface TransferEvent {
    blockNumber: number;
    from: string;
    to: string;
    value: string;
  }
  const [eventStream, setEventStream] = useState<TransferEvent[]>([]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const address: string = '0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f'; // https://kovan.etherscan.io/address/0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f
    contract = new ethers.Contract(address, ERC20_ABI, provider);

    contract.on("Transfer", (...tx) => {
      console.log("tx: ", tx);
      const {blockNumber, args} = tx[3];
      const {from, to, value} = args
      console.log("from: ", from);
      console.log("to: ", to);
      console.log("value: ", ethers.utils.formatEther(value));
      setEventStream((e) => ([...e, {blockNumber, from, to, value: ethers.utils.formatEther(value)}]))})
    
  }, [])



  // Second method to read events from a smart contract with provider
  
  // const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  // let filter = {
  //   address: "0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f",
  //   topics: [ethers.utils.id("event Transfer(address indexed from, address indexed to, uint256 value)")]
  // }
  // providerx.on(filter, ({...result}) => {
  //   console.log("result: ",result);
  // });



  return (
    <>
      <section className="container d-flex">
        <main>
          <h1 className="main-title">Let's learn how read smart contract events</h1>

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
                <br /><a href='https://kovan.etherscan.io/address/0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f/' target="_blank" style={{textDecoration: "underline"}}> Zia Coin Contract on EtherScan </a>

                <br /><br />

                <div>
                  <button onClick={mint}>Mint 10 Zia Coins</button>
                </div>


                <br /><br />

                <div>
                  <div >Reading Transfer Events from Zia Coin Contract . . .</div>
                  
                  <div>
                    {
                      eventStream.length > 0 ? 
                      eventStream.map((transfer, index) =>  (
                          <div key={index} style={{margin: "5px 0px", borderBottom: "1px solid black"}}>
                            <div>Block Number: {transfer.blockNumber}</div>
                            <div>From: {transfer.from}</div>
                            <div>To: {transfer.to}</div>
                            <div>Value: {transfer.value}</div>
                          </div>
                        ))
                        :
                        <div>Mint some tokens to shoot new events </div>
                    }

                  </div>

                  <br />
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
