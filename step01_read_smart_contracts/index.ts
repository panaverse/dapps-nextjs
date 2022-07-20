
import { getMainnetSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { BigNumber, ethers } from 'ethers'

async function main() {
  const mainnetProvider = ethers.getDefaultProvider('mainnet')
  const defaultSigner = ethers.Wallet.createRandom().connect(mainnetProvider)

  const sdk = getMainnetSdk(defaultSigner) // default signer will be wired with all contract instances
  // sdk is an object like { dai: DaiContract }

  const name: string = await sdk.dai.name()
  const symbol: string = await sdk.dai.symbol()
  const totalSupply: ethers.BigNumber = await sdk.dai.totalSupply()

  console.log(`Name: ${name}`)
  console.log(`Symbol: ${symbol}`)
  console.log(`Total Supply: ${totalSupply}\n`)

  const balance1: BigNumber = await sdk.dai.balanceOf(defaultSigner.address);

  console.log(`Balance1 Returned: ${balance1}`)
  console.log(`Balance1 Formatted: ${ethers.utils.formatEther(balance1)}\n`)

  const balance2: BigNumber = await sdk.dai.balanceOf('0x6c6Bc977E13Df9b0de53b251522280BB72383700');

  console.log(`Balance2 Returned: ${balance2}`)
  console.log(`Balance2 Formatted: ${ethers.utils.formatEther(balance2)}\n`)
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })




/* As covered in the video

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

*/