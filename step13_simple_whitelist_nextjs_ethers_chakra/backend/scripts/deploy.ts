import { ethers } from "hardhat";

async function main() {

  // Another way to deploy the contract

  // const [deployer] = await ethers.getSigners();
  // console.log("deployer: ", deployer.address);
  // console.log("getChainId: ", await deployer.getChainId());
  // const chainId = await deployer.getChainId();

      // If we are on a local development network, we need to deploy mocks!
    // if (chainId == 31337) {
    //     // deploying contract
    //   const whitelistContract = await ethers.getContractFactory("Whitelist");
    //   const whitelist = await whitelistContract.deploy(250);
    //   await whitelist.deployed();
    //   console.log("Launchpad contract deployed on local blockchian!")

    // }
    // else {
        // deploying contract
        // const whitelistContract = await ethers.getContractFactory("Whitelist");
        // const whitelist = await whitelistContract.deploy(250);
        // await whitelist.deployed();
        // console.log("Launchpad contract deployed on testnetwork!")  
        // await verify(whitelist.address, [])
    // }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
