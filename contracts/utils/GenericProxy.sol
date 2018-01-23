pragma solidity ^4.0.18;

import "./Owned.sol";


contract Proxy is Owned {
    event Forwarded (
        address indexed destination,
        uint value,
        bytes data
    );

    function forward(address destination, uint value, bytes data) onlyOwner {
        if (!destination.call.value(value)(data)) {
            throw;
        }
        Forwarded(destination, value, data);
    }
}