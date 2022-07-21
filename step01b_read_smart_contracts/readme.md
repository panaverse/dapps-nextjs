# Connect to Samart Contracts using Ethers.js using Types SDK

To get a initial understanding of Ethers we are going to follow [Master Ethers.js for Blockchain Step-by-Step](https://www.youtube.com/watch?v=yk7nVp5HTCk)

Watch Video 23:30 to 37:25

[Download and Install Node](https://nodejs.org/en/download/)

Create an [Infura Account](https://infura.io/)

Install Typescript:

npm install -g typescript 

mkdir step01_read_smart_contracts

npm init

npm i ethers

Now Generate the tscofig.json file:

tsc --init

We have two options to generate types:

1. [TypeChain](https://github.com/dethcrypto/TypeChain)
2. [eth-sdk](https://github.com/dethcrypto/eth-sdk)

TypeChain generates only TypeScript typings (d.ts) files, we will be using: eth-sdk. It generates typesafe, ready to use ethers.js wrappers and uses etherscan/sourcify to automatically get ABIs based only on smart contract addresses. Under the hood, eth-sdk relies on TypeChain.

npm install --save-dev @dethcrypto/eth-sdk @dethcrypto/eth-sdk-client ts-node

Create a config file specifying contracts that we wish to interact with. Default path to this file is eth-sdk/eth-sdk.config.ts

yarn eth-sdk

When you run yarn eth-sdk. Few things will happen under the hood:

1. Etherscan API will be queried in search of ABIs corresponding to the addresses. ABIs will be downloaded into eth-sdk directory (you should commit them to git to speed up the process in the future).
2. Minimal SDK will be generated with functions like getMainnetSdk exposed. These functions wire addresses with ABIs and create ethers.js contract instances.
3. TypeScript types will be generated for SDK using TypeChain.
4. SDK is generated directly into node_modules, access it as @dethcrypto/eth-sdk-client.


Create index.ts file after reading the readme on github [eth-sdk](https://github.com/dethcrypto/eth-sdk)

tsc

node index

