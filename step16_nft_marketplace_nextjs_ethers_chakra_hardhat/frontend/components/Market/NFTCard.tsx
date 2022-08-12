import { Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { Contract, ethers } from "ethers";
import { NFTContract, NftMarketplace } from "../../types";
import addresses from "../../utils/contractAddresses.json";
import abi from "../../utils/abis.json";
import { useWeb3React } from "@web3-react/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ListedTokenData } from ".";

const NFTCard = (
    { token, setTokenData }: 
    { token: ListedTokenData, setTokenData: Dispatch<SetStateAction<ListedTokenData[] | undefined>> }) => {
    
    const { account, library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [price, setPrice] = useState<number>();
    const [isApproved, setIsApproved] = useState<boolean>();
    
    const buy = async (orderId: string) => {
        if (!provider) return;

        console.log("Buying: ", orderId);


        const signer = provider.getSigner();
        const NftMarketplace = new Contract(addresses.NftMarketplace, abi.NftMarketplace, signer) as NftMarketplace;
        const tx = await NftMarketplace.buyItem(token.address, token.id, 
            {
                value: ethers.utils.parseEther(token.price)
            });
        await tx.wait(1);

        setTokenData((e) => {
            if (!e) return;
            let updatedTokensData = e.filter((token) => {
                if (Number(token.orderId) !== Number(orderId)) {
                    return token;
                }
            })


            return updatedTokensData;
        })

        alert("Success");
    }

    return (
        <>
            <Flex justifyContent="center">
                <Box width="200px">
                    <Flex justifyContent="center" alignItems="center" margin={2}>
                        <Image src={token.image} alt={token.id} />
                    </Flex>
                    <Flex justifyContent="center"> Name: {token.name} </Flex>
                    <Flex justifyContent="center"> Token id: {token.id} </Flex>
                    <Flex justifyContent="center"> Price: {token.price} </Flex>
                </Box>
            </Flex>

            {
                    <Box m={5}>
                        <Flex justifyContent="center">
                            <Button bg="grey.800" w={200} onClick={() => buy(token.orderId)}> Buy </Button>
                        </Flex>
                    </Box>
            }

        </>
    )
}

export default NFTCard;





