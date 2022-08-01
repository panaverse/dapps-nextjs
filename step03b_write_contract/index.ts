import { getKovanSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { BigNumber, ethers } from 'ethers'


const account2: string = '' // Your account address 2

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

  
  /* Token balance of wallet owner before miniting */

  const balance1: BigNumber = await sdk.ziaCoin.balanceOf(wallet.address);

  console.log(`\nBalance before minting: ${balance1}`)
  console.log(`Balance1 before minting Formatted: ${ethers.utils.formatEther(balance1)}\n`)

  // mint yourself 100 ZC tokens
  const tx = await sdk.ziaCoin.mint(wallet.address, ethers.utils.parseEther("100"));
  await tx.wait(1);

  const balance2: BigNumber = await sdk.ziaCoin.balanceOf(wallet.address);

  console.log(`\nBalance after minting: ${balance2}`)
  console.log(`Balance after minting Formatted: ${ethers.utils.formatEther(balance2)}\n`)


  /* transfer these 100 ZC tokens to another address */
  
  const balanceOfSender_before: ethers.BigNumber = await sdk.ziaCoin.balanceOf(wallet.address)
  const balanceOfReciever_before: ethers.BigNumber = await sdk.ziaCoin.balanceOf(account2)
  console.log(`\nBalance of sender before transfering: ${balanceOfSender_before}`)
  console.log(`Balance of reciever  before transfering: ${balanceOfReciever_before}\n`)

  
  const tx2 = await sdk.ziaCoin.transfer(account2, ethers.utils.parseEther("100"))
  await tx2.wait()

  const balanceOfSender_after: ethers.BigNumber = await sdk.ziaCoin.balanceOf(wallet.address)
  const balanceOfReciever_after: ethers.BigNumber = await sdk.ziaCoin.balanceOf(account2)

  console.log(`\nBalance of sender after transfering: ${balanceOfSender_after}`)
  console.log(`Balance of reciever  after transfering: ${balanceOfReciever_after}\n`)



}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
