import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import {NFTContract, NFTContract__factory} from "../typechain";

describe("NFTContract", function () {

  it("NFTContract is working fine", async () => {
    const [deployer] = await ethers.getSigners();

    const NFTContract = await ethers.getContractFactory("NFTContract");
    const nftContract = await NFTContract.deploy();

    console.log(await nftContract.getAllURIs());
    await nftContract.mint(1);
    console.log(await nftContract.tokenURI(1));

  })


});
