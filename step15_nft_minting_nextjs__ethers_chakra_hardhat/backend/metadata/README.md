## Instructions to upload the token metadata on IPFS


Read details of standard NFT metadata JSON template [Metadata schemas](https://nftschool.dev/reference/metadata-schemas/#ethereum-and-evm-compatible-chains)

Create a new token.json file and fill it with standard fields

Go to [Pinata](https://www.pinata.cloud/) and upload token image and get its IPFS uri which looks like [this](https://gateway.pinata.cloud/ipfs/QmasgWktpH7o5sHimQ3qYZffDw3b9qkw1ZZS96qjXCeoNM)

Put his image URI in your metadata JSON file under the image's description field. 

Now upload this JSON metadata file to IPFS same way we did with image and get the IPFS uri in return. This is my [uri](https://gateway.pinata.cloud/ipfs/QmaxcnLj1yCjnYS1DYZbwFcqC3mtDkjaHGq7C1n9AvCopS).

Amazing. Now final step is to put this metadata uri inside the contract. Whenever someone will call the tokenUri function from our contract, we want to return exactly this uri.  