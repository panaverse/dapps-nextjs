import { deployments, ethers } from "hardhat"
import {network} from "hardhat";

const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("")
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const NFTContract = await deployments.get("NFTContract");
    const NftMarketplace = await deployments.get("NftMarketplace");
    fs.writeFileSync(frontEndAbiFile, JSON.stringify({NftMarketplace: NftMarketplace.abi, NFTContract: NFTContract.abi}))
}

async function updateContractAddresses() {
    const chainId = network.config.chainId;
    const NFTContract = await deployments.get("NFTContract");    
    const NftMarketplace = await deployments.get("NftMarketplace");

    let contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    contractAddresses = {NftMarketplace: NftMarketplace.address, NFTContract: NFTContract.address, chainid: chainId }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
