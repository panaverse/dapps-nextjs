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
    const ElectionContract = await deployments.get("Election");
    fs.writeFileSync(frontEndAbiFile, JSON.stringify(ElectionContract.abi))
}

async function updateContractAddresses() {
    const ElectionContract = await deployments.get("Election");    
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    contractAddresses["election"] = ElectionContract.address
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

const vote = async () => {
    
}


module.exports.tags = ["all", "frontend"]
