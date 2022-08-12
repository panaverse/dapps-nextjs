import { useWeb3React } from "@web3-react/core";


import { Box, Button, Center, Flex, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import { Contract, ethers } from "ethers";
import { NFTContract, NftMarketplace } from "../../types";

import addresses from "../../utils/contractAddresses.json";
import abi from "../../utils/abis.json";
import { useEffect, useState } from "react";
// import { TokenData } from "../../pages";
import axios from "axios";
import NFTCard from "./NFTCard";


export interface ListedTokenData {
    uri: string;
    image: string;
    id: string;
    address: string;
    name: string;
    price: string;
    orderId: string;
    seller: string;
}

interface ListedToken {
    address?: string;
    id?: string;
    price?: string;
    isApproved?: boolean
}

const Market = () => {

    const { account, library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();
    const [loading, setLoading] = useState(false);
    const [tokenData, setTokenData] = useState<ListedTokenData[]>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [listedToken, setListedToken] = useState<ListedToken>()

    const getListedTokens = async () => {

        if (!provider) return;

        const NftMarketplace = new Contract(
            addresses.NftMarketplace,
            abi.NftMarketplace,
            provider
        ) as NftMarketplace;

        setLoading(true);

        const listingsIds = await NftMarketplace.getAllOrderIds()

        const alltokensData: ListedTokenData[] = [];

        for (let i = 0; i < listingsIds.length; i++) {
            const orderId = listingsIds[i];
            const order = await NftMarketplace.getListingByOrderId(orderId);

            const nftContract = new Contract(
                order.token,
                abi.NFTContract,
                provider
            ) as NFTContract;

            const uri = await nftContract.tokenURI(order.id);
            const res = await axios.get(uri);
            const _tokenData: ListedTokenData = {
                uri: uri,
                image: res.data.properties.image.description,
                id: order.id.toString(),
                address: order.token,
                name: res.data.properties.name.description,
                price: ethers.utils.formatEther(order.price),
                orderId: order.orderId.toString(),
                seller: order.seller

            }
            alltokensData.push(_tokenData);
        }

        setTokenData(alltokensData);
        setLoading(false);

    }

    const handleAddress = (address: string) => {
        if (ethers.utils.isAddress(address)) {
            setListedToken((e) => ({ ...e, address }))
        }
        else {
            alert("Invalid address")
            throw ("Invalid address")
        }
    }

    const handleTokenId = (id: string) => {
        setListedToken((e) => ({ ...e, id }))
    }

    const handleTokenPrice = (price: string) => {
        if (Number(price) > 0) {
            setListedToken((e) => ({ ...e, price }))
        }
    }

    const handleApprove = async () => {
        if (!provider || !account) return;
        if (!listedToken?.address || !listedToken.id || !listedToken.price) return;

        try {
            const signer = provider.getSigner();
            const contract = new Contract(listedToken.address, abi.NFTContract, signer) as NFTContract;
            const ownerOfToken = await contract.ownerOf(listedToken.id);

            if (ownerOfToken !== account) {
                alert("you are not owner of this token");
                throw ("Not owner");
            }

            const approvedTo = await contract.getApproved(listedToken.id);
            if (approvedTo !== addresses.NftMarketplace) {
                const tx = await contract.approve(addresses.NftMarketplace, listedToken.id);
                await tx.wait(1);
            }
        }
        catch (e: any) {
            alert(JSON.parse(JSON.stringify(e)).reason)
        }

        setListedToken((e) => ({ ...e, isApproved: true }))

    }

    const handleListed = async () => {
        if (!provider || !account) return;
        if (!listedToken?.address || !listedToken.id || !listedToken.price) return;

        try {
            const signer = provider.getSigner();
            const contract = new Contract(listedToken.address, abi.NFTContract, signer) as NFTContract;
            const ownerOfToken = await contract.ownerOf(listedToken.id);
            if (ownerOfToken !== account) {
                alert("you are not owner of this token");
                throw ("Not owner");
            }

            const contractmarket = new Contract(addresses.NftMarketplace, abi.NftMarketplace, signer) as NftMarketplace;
            const tx = await contractmarket.listItem(listedToken.address, listedToken.id, ethers.utils.parseEther(listedToken.price));
            await tx.wait(1);

            // fetch order detail
            const order = await contractmarket.getListing(listedToken.address, listedToken.id);
            const uri = await contract.tokenURI(order.id);
            const res = await axios.get(uri);
            const _tokenData: ListedTokenData = {
                uri: uri,
                image: res.data.properties.image.description,
                id: order.id.toString(),
                address: order.token,
                name: res.data.properties.name.description,
                price: ethers.utils.formatEther(order.price),
                orderId: order.orderId.toString(),
                seller: order.seller
            }

            setTokenData((e) => ([...e!, _tokenData]))
            handleClose();

        }
        catch (e: any) {
            alert(JSON.parse(JSON.stringify(e)).reason)
        }

        setListedToken(undefined)

    }

    const handleClose = () => {
        onClose();
        setListedToken(undefined);
    }

    useEffect(() => {
        getListedTokens();
    }, [provider])

    if (loading) return <Center margin={20}><Spinner marginRight={2} /> Processing. . . </Center>

    return (
        <Box>
            <Box>
                <Flex justifyContent="center">
                    <Button onClick={onOpen}>
                        List NFT
                    </Button>

                    {
                        isOpen && (
                            <Modal isOpen={isOpen} onClose={handleClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader> List { } to the Market Place </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>

                                        <Text>Enter Token Address</Text>
                                        <Input type="text" isDisabled={listedToken?.isApproved} value={listedToken?.address} onChange={(e) => handleAddress(e.target.value)} />
                                        <br /> <br />
                                        <Text>Enter Token Id</Text>
                                        <Input type="text" isDisabled={listedToken?.isApproved} value={listedToken?.id} onChange={(e) => handleTokenId(e.target.value)} />
                                        <br /> <br />
                                        <Text>Choose a price for this token</Text>
                                        <Flex alignItems="center" mt={2}>
                                            <Input type="number" isDisabled={listedToken?.isApproved} value={listedToken?.price} onChange={(e) => handleTokenPrice(e.target.value)} w="90%" />
                                            <Text ml={2}>ETH</Text>
                                        </Flex>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={handleApprove} isDisabled={listedToken?.isApproved}>
                                            Approve
                                        </Button>
                                        <Button variant='ghost' onClick={handleListed} isDisabled={!listedToken?.isApproved}>List</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        )
                    }



                </Flex>
            </Box>
            <Grid templateColumns='repeat(4, 1fr)' gap={6} marginTop={10}>
                {
                    tokenData && tokenData.map((token, index) => {
                        return (
                            <GridItem key={index} border="0.5px solid #ede9e9" margin={5}>
                                <NFTCard token={token} setTokenData={setTokenData} />
                            </GridItem>
                        )
                    })
                }
            </Grid>
        </Box>
    )
}


export default Market