import Head from "next/head";
import Web3Modal from "web3modal";
import { providers, Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import addresses from "../utils/contractAddresses.json";
import abi from "../utils/abis.json";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'

interface User {
  address: string;
  singer: ethers.Signer;
}

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const [whitelistedLimit, setWhitelistedLimit] = useState(0);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [whitelistedUsersList, setWhitelistedUsersList] = useState<string[]>([]);

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

        const { chainId } = await provider.getNetwork();

        if (chainId !== 42) {
          window.alert("Change the network to Kovan please");
          throw new Error("Change network to Rinkeby");
        }
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setUser({
          address: address,
          singer: signer
        })



        checkIfAddressInWhitelist(signer);
        setWalletConnected(true)

      }

      getWhitelistedData();

    } catch (err) {
      alert("You need to download a web3 wallet")
      console.error(err);
    }
  };

  const addAddressToWhitelist = async () => {
    try {
      if (user?.singer) {
        const whitelistContract = new Contract(
          addresses.whitelist,
          abi,
          user.singer
        );
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);

        getWhitelistedData();

        setJoinedWhitelist(true);

      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async (singer: providers.JsonRpcSigner) => {
    setLoading(true)
    try {
      const whitelistContract = new Contract(
        addresses.whitelist,
        abi,
        singer
      );
      // call the whitelistedAddresses from the contract
      const address = await singer.getAddress()
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);

      getWhitelistedData();


    } catch (err) {
      console.error(err);
    }

    setLoading(false)

  };

  const getWhitelistedData = async () => {

    try {
      const provider = ethers.getDefaultProvider("kovan");
      const whitelistContract = new Contract(
        addresses.whitelist,
        abi,
        provider
      );

      const _whitelistedLimit = await whitelistContract.maxWhitelistedAddresses();
      setWhitelistedLimit(_whitelistedLimit);

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);

      const _whitelistedUsers = await whitelistContract.getWhitelistedAddressesList();
      setWhitelistedUsersList(_whitelistedUsers);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWhitelistedData();
  }, [])


  const renderButton = () => {
    if (loading) return <Center ><Spinner marginRight={2} /> Processing. . . </Center>

    if (!walletConnected) {
      return <Button bgColor='#02645f' color="white" onClick={connectWallet}> Connect Wallet </Button>
    }

    return (
      <div>
        {
          user?.address && joinedWhitelist && (
            <Text fontSize='xl'> You are already in the list. </Text>
          )
        }
        {
          user?.address && !joinedWhitelist && (
            <Button bgColor='#02645f' color="white" onClick={addAddressToWhitelist}>
              Click to Add yourself in whitelist
            </Button>
          )
        }

      </div>
    )
  };

  return (
    <Box margin={10}>

      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <div>

          <Flex justifyContent="center" alignItems="center">
            <Heading fontSize='3xl'>Welcome to PIAIC's Whitelisting Dapp! </Heading >
            <span style={{ marginLeft: "10px" }}>
              <img width={40} src="./piaic.svg" />
            </span>
          </Flex>

          <Divider padding={3} />

          <Text textAlign="center" margin={5}>
            <b>{numberOfWhitelisted}</b> have already joined the Whitelist and only <b>{whitelistedLimit - numberOfWhitelisted}</b> slots left,
          </Text>

          <Flex margin={10} justifyContent ="center">
            {renderButton()}
          </Flex>

          <div>
            <Text fontSize="2xl">List of whitelisted users</Text>
            {
              whitelistedUsersList.map((user, index) => (
                <Text fontSize="xl"key={index}>{index + 1}: {user}</Text>
              ))
            }
          </div>

        </div>
      </Box>

    </Box>

  );
}
