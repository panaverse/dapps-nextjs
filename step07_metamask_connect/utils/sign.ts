import { ethers } from "ethers";

export const signMessage = () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  try {
    signer.signMessage("Hello World").then((result) => {
      console.log(result);
    });
  } catch (error) {
    // handle error
    console.log(error);
  }
};