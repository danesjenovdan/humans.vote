pragma solidity ^0.4.18;


// Owned contracts are owned by a single address, and owner has rights issued through onlyOwner modifier
contract Owned {
    address public owner;

    function Owned()  public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}