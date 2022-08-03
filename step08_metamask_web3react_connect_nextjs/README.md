# Connect Metamask using @web3-react/core

[Install Metamask](https://github.com/LearnWeb3DAO/Crypto-Wallets)

[@web3-react/core documentation](https://www.npmjs.com/package/@web3-react/core)

[How to Connect your Smart Contracts to Metamask](https://www.youtube.com/watch?v=pdsYCkUWrgQ)


npx create-next-app step08_metamask_web3react_connect_nextjs --ts

## Quickstart
1. Install packages

```bash
yarn add @web3-react/core @web3-react/injected-connector @ethersproject/providers ethers
```

2. Wrap the root of the app with Web3ReactProvider
```bash
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
```

3. Usage 

```bash

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

const { active, activate, deactivate, chainId, account, library} = useWeb3React();

async function connect() {
    await activate(injected);
}

```


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
