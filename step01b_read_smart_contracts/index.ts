
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
