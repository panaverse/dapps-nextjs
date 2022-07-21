import { ethers } from 'ethers');

const INFURA_ID: string = '' // for a test network
const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_ID}`)

const account1: string = '' // Your account address 1
const account2: strkng = '' // Your account address 2

const privateKey1: string = '' // Private key of account 1
const wallet: ethers.Wallet = new ethers.Wallet(privateKey1, provider)

const main = async () => {
    const senderBalanceBefore: ethers.BigNumber = await provider.getBalance(account1)
    const recieverBalanceBefore: ethers.BigNumber = await provider.getBalance(account2)

    console.log(`\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`)
    console.log(`reciever balance before: ${ethers.utils.formatEther(recieverBalanceBefore)}\n`)

    const tx: ethers.providers.TransactionResponse = await wallet.sendTransaction({
        to: account2,
        value: ethers.utils.parseEther("0.025")
    })

    await tx.wait() //waiting for it to be mined
    console.log(tx)

    const senderBalanceAfter: ethers.BigNumber = await provider.getBalance(account1)
    const recieverBalanceAfter: ethers.BigNumber = await provider.getBalance(account2)

    console.log(`\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`)
    console.log(`reciever balance after: ${ethers.utils.formatEther(recieverBalanceAfter)}\n`)
}

main()