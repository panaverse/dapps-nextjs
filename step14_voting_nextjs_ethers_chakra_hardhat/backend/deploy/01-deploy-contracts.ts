import {network} from "hardhat";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {verify} from "../utils/verify"

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

module.exports = async ({getNamedAccounts, deployments}: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const {deployer}  = await getNamedAccounts()
    const chainId = network.config.chainId;

    console.log("chainId: ", chainId);
    console.log("deployer: ", deployer);

    if (chainId == 31337) {
        // deploying contract
        await deploy("Election", {
            from: deployer,
            args: [],
            log: true,
        })
        log("Election contract deployed on local blockchian!")

    }
    else {
        // deploying contract
        const election = await deploy("Election", {
            from: deployer,
            args: [],
            log: true,
        })
        log("Election contract deployed on testnet!")
        await sleep(5000);
        await verify(election.address, [])
    }


}