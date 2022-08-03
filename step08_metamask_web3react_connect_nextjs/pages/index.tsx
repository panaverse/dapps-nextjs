import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum: any
  }
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export default function Home() {
  const [hasMetamask, setHasMetamask] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  const {
    active,
    activate,
    deactivate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const disconnect = async () => {
    deactivate();

  }

  return (
    <div>
      <h1>@web3-react/core Library is Awesome</h1>

      {hasMetamask ? (
        active ? (
            <>
              Connected with address: {account} <br />
              <button onClick={() => disconnect()} > Disconnect </button>
            </>
          ) : (
            <button onClick={() => connect()}>Connect</button>
          )
      ) : (
        "Please install metamask"
      )}

    </div>
  );
}


