import type { NextPage } from 'next';
import { useState, useEffect } from "react";
import { signMessage } from "../utils/sign";
import Link from "next/link";
import Metamask from "../component/Metamask";

interface ClientStatus{
  isConnected: boolean;
  address?: string;
}

const Index: NextPage = () => {

  const [haveMetamask, sethaveMetamask] = useState<boolean>(true);

  const [clientStatus, setClientStatus] = useState<ClientStatus>({
    isConnected: false,
  });


  const checkConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setClientStatus({
          isConnected: true,
          address: accounts[0],
        });
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
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setClientStatus({
        isConnected: true,
        address: accounts[0],
      });
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };


  useEffect(() => {
    checkConnection();
  }, []);
  

  return (
    <>
      {/* Navbar */}
      <nav className="fren-nav d-flex">
        <div>
          <h3>MENU_</h3>
        </div>
        <div className="d-flex" style={{ marginLeft: "auto" }}>
          <div>
            <button className="btn connect-btn" onClick={connectWeb3}>
              {clientStatus.isConnected ? (
                <>
                  {clientStatus.address?.slice(0, 4)}...
                  {clientStatus.address?.slice(38, 42)}
                </>
              ) : (
                <>Connect Wallet</>
              )}
            </button>
          </div>
          <div>
            <Link href="https://twitter.com/asaolu_elijah">
              <button className="btn tw-btn">TW</button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Navbar end */}

      <section className="container d-flex">
        <main>
          <h1 className="main-title">Awesome DApp 🚀</h1>

          <p className="main-desc">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem
            suscipit perferendis tempore <br /> eveniet id pariatur error
          </p>

          {/* ---- */}
          <p>
            {!haveMetamask ? (
              <Metamask />
            ) : clientStatus.isConnected ? (
              <>
                <br />
                <h2>You're connected ✅</h2>
                <button
                  onClick={signMessage}
                  type="button"
                  className="btn sign-btn"
                >
                  Sign Message
                </button>
              </>
            ) : (
              <>
                <br />
                <button className="btn connect-btn" onClick={connectWeb3}>
                  Connect Wallet
                </button>
              </>
            )}
          </p>
          {/* ---- */}
        </main>
      </section>
    </>
  );
};

export default Index;
