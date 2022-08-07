# A simple whitelist dapp with ethers chakra and next js

Create two directories, one for backend where we will set up a hardhat environment to make a smart contract and second for the frontend where we will setup a next.js app for our frontend. 


## Frontend

Create a new next project

```bash
npx create-next-app@latest frontend --ts
```


## Backend

Create a fresh Hardhat project inside the backend directory with the following command. 
```bash
npx hardhat
```
Then add all the required modules.
```bash
yarn -D add @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle @typechain/ethers-v5 @typechain/hardhat chai dotenv ethereum-waffle ethers hardhat-deploy hardhat-gas-reporter  solidity-coverage ts-node typescript
```

Then:
- Make a new contract file in the contract directory and use the contract code from this example
- Update the hardhat.config.ts file
- Create a new directory with name "deploy" and add deployment scripts as mentioned in this project
- Make a new .env file and put all the keys in there 

# Compile the project
```bash
npx hardhat compile
```

# Deploy the project on test net
Before deploying, make sure you have made a next project in the frontend directory because deployment scripts will try to write the deployed contract address and abi in the frontend directory.

```bash
npx hardhat deploy --network kovan
```

# Finally
All set up. Deployment scripts have updatd the contract's Address and ABI in the frontend/utils/ directory. You are ready to use the contract on the frontend. 



