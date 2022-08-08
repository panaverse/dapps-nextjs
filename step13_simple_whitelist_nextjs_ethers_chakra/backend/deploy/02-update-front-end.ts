import { deployments, ethers } from "hardhat"

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
    const whitelistContract = await deployments.get("Whitelist");
    fs.writeFileSync(frontEndAbiFile, JSON.stringify(whitelistContract.abi))
}

async function updateContractAddresses() {
    const whitelistContract = await deployments.get("Whitelist");
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    contractAddresses["whitelist"] = whitelistContract.address
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
