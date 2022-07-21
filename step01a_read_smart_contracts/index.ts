import { ethers } from 'ethers';

const INFURA_ID: string = ''
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];

const address: string = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const contract: ethers.Contract = new ethers.Contract(address, ERC20_ABI, provider)

const main = async () => {
    const name: string = await contract.name()
    const symbol: string = await contract.symbol()
    const totalSupply: ethers.BigNumber = await contract.totalSupply()

    console.log(`\nReading from ${address}\n`)
    console.log(`Name: ${name}`)
    console.log(`Symbol: ${symbol}`)
    console.log(`Total Supply: ${totalSupply}\n`)

    const balance: ethers.BigNumber = await contract.balanceOf('0x6c6Bc977E13Df9b0de53b251522280BB72383700')

    console.log(`Balance Returned: ${balance}`)
    console.log(`Balance Formatted: ${ethers.utils.formatEther(balance)}\n`)
}

main()

