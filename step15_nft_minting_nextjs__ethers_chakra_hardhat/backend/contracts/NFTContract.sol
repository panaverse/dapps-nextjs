// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract NFTContract is ERC721Enumerable {
    
    uint256 public tokenCounters;
    string public uriBase = "https://gateway.pinata.cloud/ipfs/QmbHcHFXU3r2HpkGRMCZVnDMgLQqwicSvUEZyPhtB899fk/";
    string public uriExtention = ".json";

    mapping (uint256 => string) public uri;
    string[] public urisTypes = ["piaic1", "piaic2", "piaic3"];
    
    constructor() ERC721("PIAIC Token", "PIAIC") {}

    function mint(uint8 _tokenType) public {

        require(_tokenType >= 0 && _tokenType < urisTypes.length, "invalid type" );

        string memory tokenUri = string(bytes.concat(bytes(uriBase), bytes(urisTypes[_tokenType]), bytes(uriExtention)));
        console.log("tokenUri: ", tokenUri);

        tokenCounters++;
        uri[tokenCounters] = tokenUri;
        _safeMint(msg.sender, tokenCounters);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return uri[tokenId];
    }

    function getAllURIs() public view returns (string[] memory) {
        string[] memory alluris = new string[](3);
        for(uint8 i = 0; i < urisTypes.length; i++){
            alluris[i] = string(bytes.concat(bytes(uriBase), bytes(urisTypes[i]), bytes(uriExtention)));
        }
        return alluris;
    }


}