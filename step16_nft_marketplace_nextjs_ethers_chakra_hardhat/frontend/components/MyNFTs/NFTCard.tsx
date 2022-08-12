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
    
    const checkIfApproved = async () => {
        if(!provider || !account) return;
        const contract = new Contract(addresses.NFTContract, abi.NFTContract, provider) as NFTContract;
        const approvedTo = await contract.getApproved(token.id);
        const _isApproved = approvedTo == addresses.NftMarketplace;
        setIsApproved(_isApproved);
    }

    const handleApprove = async () => {
        if(!provider || !account) return;
        const signer = provider.getSigner()
        const contract = new Contract(addresses.NFTContract, abi.NFTContract, signer) as NFTContract;
        try{
            const tx = await contract.approve(addresses.NftMarketplace, token.id);
            console.log("tx: ", tx);
            await tx.wait(1);
            setIsApproved(true);
        }
        catch(e){
            console.error(e);
            setIsApproved(isApproved);
        }

    }

    const handleOpen = () => {
        checkIfApproved();
        onOpen();        
    }

    const handleClose = () => {
        onClose();
        setPrice(undefined)
    }
    
    const handlePrice = (price: string) => {
        if(Number(price) > 0){
            setPrice(Number(price));
        }
    }

    const listToken = async (id: string) => {
        if (!provider || !price) return;

        const signer = provider.getSigner();
        const NFTContract = new Contract(addresses.NftMarketplace, abi.NftMarketplace, signer) as NftMarketplace;
        const tx = await NFTContract.listItem(addresses.NFTContract, id, ethers.utils.parseEther(price.toString()));
        await tx.wait(1);

        setTokenData((e) => {
            if (!e) return;
            let updatedTokensData = e.map((token) => {
                if (Number(token.id) === Number(id)) {
                    return { ...token, isListed: true, price: price.toString() }
                }
                return token;
            })
            return updatedTokensData;
        })

        await checkIfApproved();
        handleClose();+
        alert("Success");
    }

    const deListToken = async (id: string) => {
        if (!provider) return;
        console.log("Delisting", id);
        const signer = provider.getSigner();
        const NFTContract = new Contract(addresses.NftMarketplace, abi.NftMarketplace, signer) as NftMarketplace;
        const tx = await NFTContract.cancelListing(addresses.NFTContract, id);
        await tx.wait(1);

        setTokenData((e) => {
            if (!e) return;
            let updatedTokensData = e.map((token) => {
                if (Number(token.id) === Number(id)) {
                    return { ...token, isListed: false }
                }
                return token;
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
                    <Flex justifyContent="center"> ID: {token.id} </Flex>
                </Box>
            </Flex>

            {
                token.isListed ?
                    <Box m={5}>
                        <Text textAlign="center" color="green.500"> Listed with {`${token.price} ETH`}</Text>
                        <Flex justifyContent="center">
                            <Button bg="grey.800" w={200} onClick={() => deListToken(token.id)} > Delist </Button>
                        </Flex>
                    </Box>
                    :
                    <Box m={5}>
                        <Text textAlign="center" color="purple.500">List it to the market</Text>
                        <Flex justifyContent="center">
                            <Button bg="grey.800" w={200} onClick={handleOpen}> List </Button>
                        </Flex>
                    </Box>
            }

            {
                isOpen && (
                    <Modal isOpen={isOpen} onClose={handleClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader> List {token.name} to the Market Place </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text>Choose a price for this token</Text>
                                <Flex alignItems="center" mt={2}>
                                    <Input type="number" value={price} onChange={(e) => handlePrice(e.target.value)} w="90%"/> 
                                    <Text ml={2}>ETH</Text>
                                </Flex>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={handleApprove} isDisabled={isApproved}>
                                    Approve
                                </Button>
                                <Button variant='ghost' onClick={() => listToken(token.id)} isDisabled={!isApproved}>List</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </>
    )
}

export default NFTCard;





