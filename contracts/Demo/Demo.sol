pragma solidity ^0.4.18;

import "../Organisation/Organisation.sol";
import "../utils/Motion.sol";


contract Demo is Organisation {
    uint public numberOfMotions;
    string[] public motionTitles;
    address[] public motions;

    function Demo() {
        numberOfMotions = 0;
    }

    function addMotion() public returns (address motionAddress) {
        address newMotion = new Motion(0, 0, 51, "Test motion", "Test abstract");
        motions.push(newMotion);
        numberOfMotions++;
        return newMotion;
    }

    function getMotionTitle(Motion theAddress) public returns (string motionTitle) {
                
    }
}