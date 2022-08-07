import "@nomiclabs/hardhat-waffle"
import "hardhat-deploy"
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";

require("dotenv").config();

const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""


module.exports = {
  namedAccounts: {
    deployer: 0,
  },
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    kovan: {
      url: KOVAN_RPC_URL,
      chainId: 42,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};