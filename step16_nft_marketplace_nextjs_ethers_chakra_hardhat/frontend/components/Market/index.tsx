import { useWeb3React } from "@web3-react/core";


import { Box, Center, Flex, Grid, GridItem, Spinner } from "@chakra-ui/react"
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
  }


const Market = () => {

    const { active, activate, deactivate, chainId, account, library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();
    const [loading, setLoading] = useState(false);
    const [tokenData, setTokenData] = useState<ListedTokenData[]>();

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
                id: order.id.toString()    ,
                address: order.token,
                name: res.data.properties.name.description,
                price: ethers.utils.formatEther(order.price),
                orderId: order.orderId.toString()          

            }
            alltokensData.push(_tokenData);
        }

        setTokenData(alltokensData);
        setLoading(false);

    }

    useEffect(() => {
        getListedTokens();
    }, [provider])

    if (loading) return <Center margin={20}><Spinner marginRight={2} /> Processing. . . </Center>

    return (
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

    )
}


export default Market