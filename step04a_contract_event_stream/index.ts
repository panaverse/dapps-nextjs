import { ethers } from 'ethers';

const INFURA_ID = ''
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const address: string = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const contract: ethers.Contract  = new ethers.Contract(address, ERC20_ABI, provider)

const main = async () => {
    const block: number = await provider.getBlockNumber()

    const transferEvents: ethers.Event[] = await contract.queryFilter(contract.filters.Transfer(), block - 1, block);
    console.log(transferEvents)
}

main()

