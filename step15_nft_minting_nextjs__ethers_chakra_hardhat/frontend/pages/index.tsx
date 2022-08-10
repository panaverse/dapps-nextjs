import Head from "next/head";
import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import addresses from "../utils/contractAddresses.json";
import abi from "../utils/abis.json";
import { Box, Button, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { NFTContract } from "../types";
import axios from "axios";

interface User {
  address: string;
  singer: ethers.Signer;
}

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const [tokenCount, setTokenCount] = useState<string>();

  interface TokenData {
    uri: string;
    image: string;
    id: "0"|"1"|"2";
    name: string;
  }

  const [tokenData, setTokenData] = useState<TokenData[]>();

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        let web3Modal: Web3Modal;
        const providerOptions = {};

        web3Modal = new Web3Modal({
          cacheProvider: false,
          providerOptions, // required
        });

        const web3ModalProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);

        const { chainId, name } = await provider.getNetwork();
        
        console.log("chainId: ", chainId)
        console.log("addresses.chainid: ", addresses.chainid)

        if (chainId !== addresses.chainid) {
          window.alert(`Change the network to chianID: ${addresses.chainid}`);
          throw new Error(`Change the network to chianID: ${addresses.chainid}`);
        }

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setUser({
          address: address,
          singer: signer
        })

        setWalletConnected(true)

      }

      // getWhitelistedData();

    } catch (err) {
      alert("You need to download a web3 wallet")
      console.error(err);
    }
  };

  const mint = async (id: "0"|"1"|"2") => {
    if(user){
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const NFTContract: NFTContract = new ethers.Contract(addresses.NFTContract, abi, user.singer) as NFTContract;
      const tx = await NFTContract.mint(id);
      await tx.wait(1);

      const _tokenCount = await NFTContract.tokenCounters();
      setTokenCount(_tokenCount.toString());

      alert("Success");

    }
  }

  const getNFTContractDetails = async () => {
    const provider = ethers.getDefaultProvider("rinkeby");
    const NFTContract: NFTContract = new Contract(
      addresses.NFTContract,
      abi,
      provider
    ) as NFTContract;


    setLoading(true);

    const _tokenCount = await NFTContract.tokenCounters();
    setTokenCount(_tokenCount.toString());


    const tokenUris = await NFTContract.getAllURIs();
    const alltokensData: TokenData[] = [];


    for (let i = 0; i < tokenUris.length; i++) {
      const uri = tokenUris[i];
      const res = await axios.get(uri);
      const _tokenData: TokenData = {
        uri: uri,
        image: res.data.properties.image.description,
        id: i.toString() as "0"|"1"|"2",
        name: res.data.properties.name.description
      }
      alltokensData.push(_tokenData);
    }

    console.log("alltokensData ", alltokensData);

    setTokenData(alltokensData);
    setLoading(false);


  }

  useEffect(() => {
    getNFTContractDetails();
  }, [])


  const NFT = () => {

    if (loading) return <Center margin={20}><Spinner marginRight={2} /> Processing. . . </Center>

    return (
      <Box>

        <Flex border="0px solid black" justifyContent="space-evenly">
          {
            tokenData && tokenData.map((token, index) => {
              return (
                <Box margin={10} key={index}>
                  <Box width="200px">
                    <Flex justifyContent="center" alignItems="center" margin={2}>
                      <Image src={token.image} alt={token.id} />
                    </Flex>
                    <Flex justifyContent="center"> Name: {token.name} </Flex>
                    <Flex justifyContent="center"> ID: {token.id} </Flex>
                  </Box>

                  {
                    walletConnected && (
                      <Flex justifyContent="center">
                        <Button onClick={() => mint(token.id)}>Mint</Button>
                      </Flex>

                    )
                  }

                </Box>
              )
            })
          }
        </Flex>

        {
          !walletConnected && (
            <Flex justifyContent="center">
              <Button onClick={connectWallet}>Connect Wallet</Button>
            </Flex>

          )
        }


      </Box>
    )
  };

  return (
    <Box margin={10}>

      <Head>
        <title>NFT Minting Dapp</title>
        <meta name="description" content="NFT Minting Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <div>

          <Flex justifyContent="center" alignItems="center">
            <Heading fontSize='3xl'>Welcome to PIAIC's NFT Minter </Heading >
          </Flex>
          <Text fontSize='xl' textAlign="center" margin={5}>Connect your wallet and mint your PIAIC badge</Text>

          <Divider padding={2} />

          <Text><a href='https://faucets.chain.link/' target="_blank" style={{ textDecoration: "underline" }}> Get Rinkeby faucet eths </a></Text>
          <Text><a href={`https://rinkeby.etherscan.io/address/${addresses.NFTContract}`} target="_blank" style={{ textDecoration: "underline" }}> This smart contract on EtherScan </a></Text>
          <Text><a href={`https://testnets.opensea.io/`} target="_blank" style={{ textDecoration: "underline" }}> Check collection on Opensea by searching with token address</a></Text>
          
          <Divider padding={2} />

          {
            tokenCount && (
              <Flex justifyContent="center" marginTop={10}> {tokenCount} tokens has been minted. </Flex>
            )
          }

          <div>
            {NFT()}
          </div>

        </div>
      </Box>

    </Box>

  );
}