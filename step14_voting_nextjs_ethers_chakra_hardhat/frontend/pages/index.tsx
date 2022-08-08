import Head from "next/head";
import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import addresses from "../utils/contractAddresses.json";
import abi from "../utils/abis.json";
import { Box, Button, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Divider } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { Election } from "../types";

interface User {
  address: string;
  singer: ethers.Signer;
}

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  interface Candidate {
    id: number;
    name: string;
    voteCount: number;
  }

  const [totalVotes, setTotalVotes] = useState(0);
  const [candicates, setCandidates] = useState<{ count: number, candicates: Candidate[] }>({
    count: 0,
    candicates: []
  });

  interface Voter {
    voter: string;
    votedOn: number
  }
  
  const [voters, setVoters] = useState<Voter[]>([])
  const [isVoter, setIsVoter] = useState<boolean>(false);

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

        setWalletConnected(true)

      }

      // getWhitelistedData();

    } catch (err) {
      alert("You need to download a web3 wallet")
      console.error(err);
    }
  };

  const getElectionDetails = async () => {
      const provider = ethers.getDefaultProvider("kovan");
      const electionContract: Election  = new Contract(
        addresses.election,
        abi,
        provider
      ) as Election;

      if(user?.address){
          const _isVoter = await electionContract.isVoter(user.address);
          setIsVoter(_isVoter);
      }

      // Fetch Candidates Count
      const candidatesCount = await electionContract.candidatesCount();
      setCandidates((e) => ({...e, count: candidatesCount }));

      const votes = await electionContract.totalVotes();
      setTotalVotes(Number(votes));

      // Fetch Candidates Detail
      let allCandidate: Candidate[] = [];
      for(let i=1; i<=candidatesCount; i++){
        const candidate = await electionContract.candidates(i);
        const _candidate: Candidate = {
          id: Number(candidate.id),
          name: candidate.name, 
          voteCount: Number(candidate.voteCount)
        }
        allCandidate.push(_candidate);        
      }
      setCandidates((e) => ({...e, candicates: allCandidate }));

      // Fetch Voters Detail
      const voters = await electionContract.getVotersList();
      console.log("voters: ", voters);

      let allVoters: Voter[] = [];
      voters.map((voter) => {
        const _voter: Voter = {
          voter: voter.voter,
          votedOn: Number(voter.votedOn)
        }
        allVoters.push(_voter);
      })
      
      setVoters(allVoters);

    }

  const handleVote = async (id: number) => {
    console.log("user: ", user);

    if(user){
      try{
        const electionContract: Election  = new Contract(
          addresses.election,
          abi,
          user.singer
        ) as Election;
        const tx = await electionContract.vote(id);
        await tx.wait(1);
        await getElectionDetails();
      }
      catch(e){
        console.error(e);
      }
    }
  }

  const getImage = (id: number): string => {
    if(id === 1) return "./aaz.png";
    else if(id === 2) return "./ik.png";
    else if(id === 3) return "./ns.png";
    else return "";
  }

  useEffect(() => {
    getElectionDetails();
  }, [])


  const checkIfVoter = async () => {
    const provider = ethers.getDefaultProvider("kovan");
    if (user?.address) {
      const electionContract: Election = new Contract(
        addresses.election,
        abi,
        provider
      ) as Election;

      const _isVoter = await electionContract.isVoter(user.address);
      setIsVoter(_isVoter);
    }
  }

  useEffect(() => {
    checkIfVoter();
  }, [user])




  const voting = () => {
    if (loading) return <Center ><Spinner marginRight={2} /> Processing. . . </Center>

    if (!walletConnected) {
      return <Flex justifyContent="center" marginTop={10}> 
        <Button bgColor='#02645f' color="white" onClick={connectWallet}> Connect Wallet </Button>
        </Flex>
    }

    return (
      <>

        <Flex border="0px solid black" justifyContent="space-evenly">
          {
            candicates.candicates.map((candicate, index) => {
              return (
                <Box margin={10} key={index}>
                  <Flex justifyContent="center" border="0px solid black" alignItems="center">
                    <Image src={getImage(candicate.id)} alt={candicate.name} width="200px" />
                  </Flex>
                  <Flex justifyContent="center" > {candicate.name} </Flex>
                  <Flex justifyContent="center"> Votes: {candicate.voteCount} </Flex>
                  {
                    isVoter === false && (
                      <Flex justifyContent="center" marginTop={5}>
                        <Button onClick={() => handleVote(candicate.id)}> Vote </Button>
                      </Flex>
                    )
                  }
                </Box>
              )
            })
          }
        </Flex>

        {
          isVoter === true && (
            <Text textAlign="center" fontSize="l" margin={5}> You have casted your vote. </Text>
          )
        }

      </>
    )
  };

  return (
    <Box margin={10}>

      <Head>
        <title>Election Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <div>

          <Flex justifyContent="center" alignItems="center">
            <Heading fontSize='3xl'>Pakistan's General Elections. Powered by web3.0 </Heading >
            <span style={{marginLeft:"10px"}}> <img src="./pak.png" width="50px" alt="Flag" style={{border:"0.5px solid green"}} /> </span>
          </Flex>

          <Divider padding={3} />

          <Text><a href='https://faucets.chain.link/' target="_blank" style={{textDecoration: "underline"}}> Get Kovan faucet eths </a></Text>
          <Text><a href={`https://kovan.etherscan.io/address/${addresses.election}`} target="_blank" style={{textDecoration: "underline"}}> This smart contract on EtherScan </a></Text>
          
          <Divider padding={3} />

          <Flex justifyContent="center" marginTop={10}> {totalVotes} vote has been casted. </Flex>

          <div>
            {voting()}
          </div>

          <div>
            <Text fontSize="2xl">List of Voters </Text>
            {
              voters.map((voter, index) => (
                <Text fontSize="xl" key={index}>
                  <>
                    {voter.voter} @ {new Date(voter.votedOn * 1000).toDateString() }
                  </>
                </Text>
              ))
            }
          </div>

        </div>
      </Box>

    </Box>

  );
}