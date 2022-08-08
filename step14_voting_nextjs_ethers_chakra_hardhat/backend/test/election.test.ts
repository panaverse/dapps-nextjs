import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Election", function () {

  it("Election is working fine", async () => {
    const [deployer] = await ethers.getSigners();

    const Election = await ethers.getContractFactory("Election");
    const election = await Election.deploy();

    await election.vote(1);

    console.log("Candidates: ", await election.getCandidatesList());


  })


});
