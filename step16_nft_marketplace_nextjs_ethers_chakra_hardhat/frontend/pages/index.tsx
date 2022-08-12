import Head from "next/head";
import { ethers } from "ethers";
import { Box, Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import MintSection from "../components/MintSection";
import MyNFTs from "../components/MyNFTs";
import Market from "../components/Market";
import Footer from "../components/Footer";
import Header from "../components/Header";


const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337]
});

export interface User {
  address: string;
  singer: ethers.Signer;
  ethBalance: string;
}

export interface TokenData {
  uri: string;
  image: string;
  id: "0"|"1"|"2" | string;
  name: string;
}

export default function Home() {

  const { active, activate }  = useWeb3React<ethers.providers.JsonRpcProvider>();
  
  const connectWallet = async () => {
    await activate(injected);
  };
    

  const AppBody = () => {

    if(!active){
      return (
        <Flex justifyContent="center" margin={20}>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </Flex>
      )
    }

    return (
      <Tabs variant='unstyled'>
        <Box  justifyContent="center" display="flex">
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'red.300' }}  width={200} fontSize="l">Market</Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.300' }} width={200} fontSize="l">My PIAIC NFTs</Tab>
            <Tab _selected={{ color: 'white', bg: 'green.300' }} width={200} fontSize="l">Mint New</Tab>
          </TabList>
        </Box>
        <TabPanels p='2rem'>
          <TabPanel><Market /></TabPanel>
          <TabPanel><MyNFTs/></TabPanel>
          <TabPanel><MintSection /></TabPanel>
        </TabPanels>
      </Tabs>
    )
  }

  return (
    <Box margin={10}>

      <Head>
        <title>NFT Marketplace Dapp</title>
        <meta name="description" content="NFT Marketplace Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Header />
        <Box> { AppBody() } </Box>
        <Footer />
      </Box>

    </Box>
  );
}



