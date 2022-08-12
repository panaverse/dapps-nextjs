import { Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const index = () => {
    return (
        <>
            <Flex justifyContent="center" alignItems="center">
                <Heading fontSize='3xl'>Welcome to PIAIC's NFT Market Place </Heading >
            </Flex>
            <Text fontSize='xl' textAlign="center" margin={5}>Buy and Sell tokens you like</Text>
        </>
    )
}

export default index