# Connect Metamask using web3model

[Install Metamask](https://github.com/LearnWeb3DAO/Crypto-Wallets)

[web3modal documentation](https://www.npmjs.com/package/web3modal)

[How to Connect your Smart Contracts to Metamask](https://www.youtube.com/watch?v=pdsYCkUWrgQ)


npx create-next-app step07_web3model_connect_nextjs --ts


## Usage
1. Install ethers and Web3Modal NPM package
```bash
yarn add web3modal ethers
```

2. Install Provider packages
/* See Provider Options Section */

3. Then you can add Web3Modal to your Dapp as follows
```bash
import Web3 from "web3";
import Web3Modal from "web3modal";

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const instance = await web3Modal.connect();

const provider = new ethers.providers.Web3Provider(instance);
const signer = provider.getSigner();
const address = await signer.getAddress();
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
