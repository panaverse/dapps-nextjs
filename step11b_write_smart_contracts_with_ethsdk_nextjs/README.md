# Write Smart Contracts using eth-sdk in Browser

[Mint Kovan Ethers from this Faucet](https://faucets.chain.link/)

[Zia Coin Contract](https://kovan.etherscan.io/address/0xCBd02Df08BBa5b8ea2fA187ED20756FBEF5FCd3f)

npx create-next-app step11b_write_smart_contracts_with_ethsdk_nextjs --ts

We have two options to generate types:

1. [TypeChain](https://github.com/dethcrypto/TypeChain)
2. [eth-sdk](https://github.com/dethcrypto/eth-sdk)

TypeChain generates only TypeScript typings (d.ts) files, we will be using: eth-sdk. It generates typesafe, ready to use ethers.js wrappers and uses etherscan/sourcify to automatically get ABIs based only on smart contract addresses. Under the hood, eth-sdk relies on TypeChain.

npm install --save-dev @dethcrypto/eth-sdk @dethcrypto/eth-sdk-client ts-node ethers

Create a config file specifying contracts that we wish to interact with. Default path to this file is eth-sdk/eth-sdk.config.ts

yarn eth-sdk

When you run yarn eth-sdk. Few things will happen under the hood:

1. Etherscan API will be queried in search of ABIs corresponding to the addresses. ABIs will be downloaded into eth-sdk directory (you should commit them to git to speed up the process in the future).
2. Minimal SDK will be generated with functions like getMainnetSdk exposed. These functions wire addresses with ABIs and create ethers.js contract instances.
3. TypeScript types will be generated for SDK using TypeChain.
4. SDK is generated directly into node_modules, access it as @dethcrypto/eth-sdk-client.


Create index.ts file after reading the readme on github [eth-sdk](https://github.com/dethcrypto/eth-sdk)



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
