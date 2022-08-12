import { useWeb3React } from "@web3-react/core";
import { Center, Grid, GridItem, Spinner } from "@chakra-ui/react"
import { Contract, ethers } from "ethers";
import { NFTContract } from "../../types";

import addresses from "../../utils/contractAddresses.json";
import abi from "../../utils/abis.json";
import { useEffect, useState } from "react";
import { TokenData } from "../../pages";
import axios from "axios";
import MintNFTCard from "./MintNFTCard";

const MintSection = () => {

    const { library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();
    const [loading, setLoading] = useState(false);
    const [tokenData, setTokenData] = useState<TokenData[]>();

    const getNFTContractDetails = async () => {

        if (!provider) return;
        const NFTContract: NFTContract = new Contract(
            addresses.NFTContract,
            abi.NFTContract,
            provider
        ) as NFTContract;


        setLoading(true);

        const tokenUris = await NFTContract.getAllURIs();
        const alltokensData: TokenData[] = [];


        for (let i = 0; i < tokenUris.length; i++) {
            const uri = tokenUris[i];
            const res = await axios.get(uri);
            const _tokenData: TokenData = {
                uri: uri,
                image: res.data.properties.image.description,
                id: i.toString() as "0" | "1" | "2",
                name: res.data.properties.name.description
            }
            alltokensData.push(_tokenData);
        }

        setTokenData(alltokensData);
        setLoading(false);


    }

    useEffect(() => {
        getNFTContractDetails();
    }, [provider])

    if (loading) return <Center margin={20}><Spinner marginRight={2} /> Processing. . . </Center>

    return (
        <Grid templateColumns='repeat(3, 1fr)' gap={6} >
            {
                tokenData && tokenData.map((token, index) => {
                    return (
                        <GridItem key={index} border="0.5px solid #ede9e9" margin={5}>
                            <MintNFTCard token={token} />
                        </GridItem>
                    )
                })
            }
        </Grid>

    )
}


export default MintSection