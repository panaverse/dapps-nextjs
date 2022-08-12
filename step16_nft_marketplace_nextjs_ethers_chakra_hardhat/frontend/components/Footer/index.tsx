import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import addresses from "../../utils/contractAddresses.json";

const index = () => {
    return (
        <footer >
            <Flex justifyContent="center">
                <Flex margin={5} justifyContent="space-evenly" w={500}>
                    <Text><a href='https://faucets.chain.link/' target="_blank" style={{ textDecoration: "underline" }}> Rinkeby faucet </a></Text>
                    <Text><a href={`https://rinkeby.etherscan.io/address/${addresses.NftMarketplace}`} target="_blank" style={{ textDecoration: "underline" }}> EtherScan </a></Text>
                    <Text><a href={`https://testnets.opensea.io/`} target="_blank" style={{ textDecoration: "underline" }}> Opensea </a></Text>
                </Flex>
            </Flex>
        </footer>
    )
}

export default index