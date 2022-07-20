import { ethers } from 'ethers';

const INFURA_ID: string = ''
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const address: string = '0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e';

const main = async () => {
    const balance: ethers.BigNumber = await provider.getBalance(address);
    //console.log(balance);
    console.log(`\nETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`);
}

main()