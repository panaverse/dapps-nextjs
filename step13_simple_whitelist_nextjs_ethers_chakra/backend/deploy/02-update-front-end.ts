import { deployments, ethers } from "hardhat"

const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

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
    const whitelistContract = await deployments.get("Whitelist");
    const whitelist = await ethers.getContractAt("Whitelist", whitelistContract.address)
    fs.writeFileSync(frontEndAbiFile, whitelist.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const whitelistContract = await deployments.get("Whitelist");
    const whitelist = await ethers.getContractAt("Whitelist", whitelistContract.address)
    
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    
    contractAddresses["whitelist"] = whitelist.address

    // if (network.config.chainId.toString() in contractAddresses["whitelist"]) {
    //     if (!contractAddresses["whitelist"][network.config.chainId.toString()].includes(whitelist.address)) {
    //         contractAddresses["whitelist"][network.config.chainId.toString()].push(whitelist.address)
    //     }
    // } else {
    // contractAddresses["whitelist"][network.config.chainId.toString()] = [whitelist.address]
    // }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
