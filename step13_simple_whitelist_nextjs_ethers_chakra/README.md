# A simple whitelist dapp with ethers chakra and next js

Create two directories, one for backend where we will set up a hardhat environment to make a smart contract and second for the frontend where we will setup a next.js app for our frontend. 


## Frontend

Create a new next project

```bash
npx create-next-app@latest frontend --ts
```


## Backend

Create a fresh Hardhat project with the following command. 
```bash
npx hardhat
```
- Choose a template with typescript and install the required modules. 
- Make a new contract file in the contract directory 
- Add required information in the hardhat.config
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
All set up. You are ready to use the contract on the frontend. 



