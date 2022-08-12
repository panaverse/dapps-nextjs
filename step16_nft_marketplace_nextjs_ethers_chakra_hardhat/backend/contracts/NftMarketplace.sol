// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();


contract NftMarketplace is ReentrancyGuard {

    EnumerableSet.UintSet private orders;
    uint256 public orderCounter;

    struct Listing {
        uint256 orderId;
        uint256 price;
        address seller;
        address token;
        uint256 id;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(uint => Listing) private s_listingsByOrder;
    mapping(address => uint256) private s_proceeds;

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    /////////////////////
    // Main Functions //
    /////////////////////
    /*
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
     */
    // function listItem(
    //     address nftAddress,
    //     uint256 tokenId,
    //     uint256 price
    // )
    //     external
    //     notListed(nftAddress, tokenId, msg.sender)
    //     isOwner(nftAddress, tokenId, msg.sender)
    // {
    //     if (price <= 0) {
    //         revert PriceMustBeAboveZero();
    //     }
    //     IERC721 nft = IERC721(nftAddress);
    //     if (nft.getApproved(tokenId) != address(this)) {
    //         revert NotApprovedForMarketplace();
    //     }
        
    //     orderCounter++;
    //     EnumerableSet.add(orders, orderCounter);
        
    //     Listing memory _listing = Listing(price, msg.sender, nftAddress, tokenId);
    //     s_listings[nftAddress][tokenId] = _listing;
    //     s_listingsByOrder[orderCounter] = _listing;

    //     emit ItemListed(msg.sender, nftAddress, tokenId, price);
    // }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        orderCounter++;
        EnumerableSet.add(orders, orderCounter);
        
        s_listings[nftAddress][tokenId] = Listing(orderCounter, price, msg.sender, nftAddress, tokenId);
        s_listingsByOrder[orderCounter] = Listing(orderCounter, price, msg.sender, nftAddress, tokenId);

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }



    /*
     * @notice Method for cancelling listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    // function cancelListing(uint256 orderID)
    //     external
    //     isListed(orderID)
    // {
    //     Listing memory listedItem = s_listingsByOrder[orderID];

    //     require(listedItem.seller == msg.sender, "Not owner");
    //     delete (s_listings[listedItem.token][]);
    //     delete (s_listingsByOrder[tokenId]);
    //     emit ItemCanceled(msg.sender, nftAddress, tokenId);
    // }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        delete (s_listings[nftAddress][tokenId]);
        delete (s_listingsByOrder[listedItem.orderId]);
        EnumerableSet.remove(orders, listedItem.orderId);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }


    /*
     * @notice Method for buying listing
     * @notice The owner of an NFT could unapprove the marketplace,
     * which would cause this function to fail
     * Ideally you'd also have a `createOffer` functionality.
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    // function buyItem(uint256 orderID)
    //     external
    //     payable
    //     isListed(orderID)
    //     nonReentrant
    // {
    //     // Challenge - How would you refactor this contract to take:
    //     // 1. Abitrary tokens as payment? (HINT - Chainlink Price Feeds!)
    //     // 2. Be able to set prices in other currencies?
    //     // 3. Tweet me @PatrickAlphaC if you come up with a solution!
    //     Listing memory listedItem = s_listingsByOrder[orderID];
    //     if (msg.value < listedItem.price) {
    //         revert PriceNotMet(nftAddress, tokenId, listedItem.price);
    //     }
    //     s_proceeds[listedItem.seller] += msg.value;
    //     // Could just send the money...
    //     // https://fravoll.github.io/solidity-patterns/pull_over_push.html
    //     delete (s_listings[listedItem.token][listedItem.id]);
    //     delete (s_listingsByOrder[orderID]);


    //     IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
    //     emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    // }


    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        // Challenge - How would you refactor this contract to take:
        // 1. Abitrary tokens as payment? (HINT - Chainlink Price Feeds!)
        // 2. Be able to set prices in other currencies?
        // 3. Tweet me @PatrickAlphaC if you come up with a solution!
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        // Could just send the money...
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        delete (s_listings[nftAddress][tokenId]);
        delete (s_listingsByOrder[listedItem.orderId]);
        EnumerableSet.remove(orders, listedItem.orderId);

        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }




    /*
     * @notice Method for updating listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param newPrice Price in Wei of the item
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {   
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        s_listings[nftAddress][tokenId].price = newPrice;
        s_listingsByOrder[listedItem.orderId].price = newPrice;

        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }



    /*
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getAllOrderIds()
        external
        view
        returns (uint256[] memory)
    {
        return EnumerableSet.values(orders);
    }

    function getListingByOrderId(uint256 orderId)
        external
        view
        returns (Listing memory)
    {
        return s_listingsByOrder[orderId];
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

    /// @notice All events

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

}
