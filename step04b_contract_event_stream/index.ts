import { getKovanSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { BigNumber, ethers } from 'ethers'


const testnetProvider = ethers.getDefaultProvider('kovan')
const privateKey1: string = '' // Private key of account 1
const wallet: ethers.Wallet = new ethers.Wallet(privateKey1, testnetProvider)


async function main() {

  const sdk = getKovanSdk(wallet) // default signer will be wired with all contract instances

  const name: string = await sdk.ziaCoin.name()
  const symbol: string = await sdk.ziaCoin.symbol()
  const decimals: number = await sdk.ziaCoin.decimals()
  const totalSupply: ethers.BigNumber = await sdk.ziaCoin.totalSupply()


  /* Token information */

  console.log(`Name: ${name}`)
  console.log(`Symbol: ${symbol}`)
  console.log(`Decimal: ${decimals}`)
  console.log(`Total Supply: ${totalSupply}\n`)


  /* Mint Tokens to read tranfer event later */

  const tx = await sdk.ziaCoin.mint(wallet.address, ethers.utils.parseEther("100"));
  await tx.wait(1);


  const block: number = await testnetProvider.getBlockNumber()

  const transferEvents: ethers.Event[] = await sdk.ziaCoin.queryFilter(sdk.ziaCoin.filters.Transfer(), block - 1, block);
  console.log(transferEvents)


}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
