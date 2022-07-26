import { ethers } from 'ethers';

const INFURA_ID: string = ''
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

const address: string = '0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e';

const main = async () => {
    
    const block: number = await provider.getBlockNumber();

    console.log(`\nBlock Number: ${block}\n`);

    const blockInfo: ethers.providers.Block = await provider.getBlock(block);

    console.log(blockInfo);

    const { transactions } = await provider.getBlockWithTransactions(block);

    console.log(`\nLogging first transaction in block:\n`)
    console.log(transactions[0])
}

main()