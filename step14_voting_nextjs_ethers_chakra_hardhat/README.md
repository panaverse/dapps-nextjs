# A simple Voting dapp with ethers chakra and next js

# Important resources
- [Building a complete voting Dapp](https://livebook.manning.com/book/building-ethereum-dapps/chapter-12)
- [A simple election Dapp](https://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial)

# Let's start

Create two directories, one for backend where we will set up a hardhat environment to make a smart contract and second for the frontend where we will setup a next.js app for our frontend. 


## Frontend

Create a new next project

```bash
npx create-next-app@latest frontend --ts
```


## Backend

Create a fresh Hardhat project inside the backend directory with the following command. 

```bash
yarn -D add hardhat
```

```bash
npx hardhat
```
Then add all the required modules mentioned in the cmd.

Then:
- Make a new contract file in the contract directory and use the contract code from this example
- Update the hardhat.config.ts file
- Create a new directory with name "deploy" and add deployment scripts as mentioned in this project
- Make a new .env file and put all the keys in there
- Add node module for "hardhat-deploy" and import it in hardhat.config.ts file. 

- Note: before compiling the project, inside hardhat.config.ts, update the outDir field in typechian section to tell the project where to generate the types of the contract. After developing the contract and testing it, we need to generate types in the frontend section.

typechain: {
    outDir: './typechain',
    // outDir: '../frontend/types',      (When everything is good and you need to generate types for frontend)
}

# Compile the project


```bash
npx hardhat compile
```

# Deploy the project on test net
Before deploying, make sure you have made a next project in the frontend directory because deployment scripts will try to write the deployed contract address and abi in the frontend directory. Also add varify.ts file in utils directory and helper-hardhat-config.js file in the root of the project.

```bash
npx hardhat deploy --network kovan
```

# Finally
All set up. Deployment scripts have updatd the contract's Address and ABI in the frontend/utils/ directory. You are ready to use the contract on the frontend. 



