import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import addresses from "../../utils/contractAddresses.json";
import abi from "../../utils/abis.json";
import { Contract, ethers } from "ethers";
import { NFTContract, NftMarketplace } from "../../types";
import axios from "axios";
import NFTCard from "./NFTCard";

export interface ListedTokenData {
    uri: string;
    image: string;
    id: string;
    name: string;
    isListed: boolean;
    price: string;
    orderId: string;
  }

const MyNFTs = () => {

    const { chainId, account, library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();
    const [userBalance, setUserBalance] = useState<string>();
    const [userProceeds, setUserProceeds] = useState<string>();
    const [tokenData, setTokenData] = useState<ListedTokenData[]>();
    console.log("tokenData: ", tokenData);

    const fetchUserNFTDetail = async () => {
        
        if (chainId !== addresses.chainid) {
            window.alert(`Change the network to chianID: ${addresses.chainid}`);
            throw (`Change the network to chianID: ${addresses.chainid}`);
        }
        
        if (provider && account) {
            const ethBalance = ethers.utils.formatEther(await provider.getBalance(account));
            setUserBalance(ethBalance);
            
            const marketContract = new Contract(addresses.NftMarketplace, abi.NftMarketplace, provider) as NftMarketplace;
            const contract = new Contract(addresses.NFTContract, abi.NFTContract, provider) as NFTContract;
            const NFTscount = Number(await contract.balanceOf(account));
            
            const alltokensData: ListedTokenData[] = [];
            
            console.log("NFTscount: ", NFTscount);

            for(let i=0;  i < NFTscount; i++){
                const tokenID = Number(await contract.tokenOfOwnerByIndex(account, i));
                const listingDetail = await marketContract.getListing(addresses.NFTContract, tokenID);

                const uri = await contract.tokenURI(tokenID);
                const res = await axios.get(uri);
                const _tokenData: ListedTokenData = {
                    uri: uri,
                    image: res.data.properties.image.description,
                    id: tokenID.toString(),
                    name: res.data.properties.name.description,
                    isListed: Number(listingDetail.price) > 0,
                    price: ethers.utils.formatEther(listingDetail.price),
                    orderId: listingDetail.orderId.toString()
                }
                alltokensData.push(_tokenData);                
            }

            setTokenData(alltokensData);



            const proceedings = ethers.utils.formatEther(await marketContract.getProceeds(account));
            setUserProceeds(proceedings);



        }
    }

    const withdrawProceeds = async () => {
        if(!provider || !account) return;
        const signer = provider.getSigner();
        const NftMarketplace = new Contract(addresses.NftMarketplace, abi.NftMarketplace, signer) as NftMarketplace;
        const tx = await NftMarketplace.withdrawProceeds();
        await tx.wait(1);

        const newProceeds = await NftMarketplace.getProceeds(account);
        setUserProceeds(ethers.utils.formatEther(newProceeds));

    }

    useEffect(() => {
        if (provider !== undefined) {
            fetchUserNFTDetail();
        }
    }, [provider])

    return <Box>
        <Box>
            <Text>Address: {account} </Text>
            <Text>Perosnal Balance: {userBalance} EThs </Text>
            <Flex>
                <Text>Proceeds: {userProceeds} ETHs</Text>
                {
                    Number(userProceeds) > 0 && (
                        <Button size="s" ml={5} onClick={withdrawProceeds}> Withdraw </Button>
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
}


export default MyNFTs;