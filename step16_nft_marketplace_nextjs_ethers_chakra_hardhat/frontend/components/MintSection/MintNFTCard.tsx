
import { Box, Button, Flex, Image } from "@chakra-ui/react"
import { Contract, ethers } from "ethers";
import { TokenData } from "../../pages";
import { NFTContract } from "../../types";
import addresses from "../../utils/contractAddresses.json";
import abi from "../../utils/abis.json";
import { useWeb3React } from "@web3-react/core";



const MintNFTCard = ({ token }: { token: TokenData }) => {
    const { library: provider } = useWeb3React<ethers.providers.JsonRpcProvider>();

    const mint = async (id: string) => {
        if (!provider) return;
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const NFTContract: NFTContract = new Contract(addresses.NFTContract, abi.NFTContract, signer) as NFTContract;
        const tx = await NFTContract.mint(id);
        await tx.wait(1);

        alert("Success");
    }

    return (
        <>
            <Flex justifyContent="center">
                <Box width="200px" >
                    <Flex justifyContent="center" alignItems="center" margin={2}>
                        <Image src={token.image} alt={token.id} />
                    </Flex>
                    <Flex justifyContent="center"> Name: {token.name} </Flex>
                    <Flex justifyContent="center"> ID: {token.id} </Flex>
                </Box>
            </Flex>

            <Flex justifyContent="center" m={5}>
                <Button onClick={() => mint(token.id)}> Mint </Button>
            </Flex>
        </>
    )
}

export default MintNFTCard;



