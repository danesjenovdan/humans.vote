pragma solidity ^0.4.18;

// import Owned
import "./Owned.sol";


contract PrivateOrg is Owned {
    mapping (address => uint) public memberId; // mapping addresses to memberIds
    Member[] public members; // dynamic array of Member objects

    event MembershipChanged(address member, bool isMember); // we got a new member or we lost one

    // member "object" structure
    struct Member {
        address member;
        string name;
        uint memberSince;
    }

    // Modifier that allows only shareholders to vote and create new proposals
    // msg.sender needs to have non-zero value in memberId mapping
    modifier onlyMembers {
        require(memberId[msg.sender] != 0);
        _;
    }

    /**
     * Constructor function
     * Needs minimumQuorumForProposals, minutesForDevate, marginOfVotesForMajority
     */
    function PrivateOrg () public {
        // It’s necessary to add an empty first member
        addMember(0, "");

        // and let's add the founder, to save a step later
        addMember(owner, "founder");
    }

    /**
     * Add member function
     *
     * Make `targetMember` a member named `memberName`
     *
     * @param targetMember ethereum address to be added
     * @param memberName public name for that member
     * 
     * modified with onlyOwner
     */
    function addMember(address targetMember, string memberName) public onlyOwner {
        // get member id
        uint id = memberId[targetMember];
        // if member does not exist add member
        if (id == 0) {
            memberId[targetMember] = members.length;
            id = members.length++;
        }

        // add this specific Member to members
        members[id] = Member({member: targetMember, memberSince: now, name: memberName});
        // emit MembershipChanged event
        MembershipChanged(targetMember, true);
    }

    /**
     * Remove member
     *
     * @notice Remove membership from `targetMember`
     *
     * @param targetMember ethereum address to be removed
     *
     * modified with onlyOwner
     */
    function removeMember(address targetMember) public onlyOwner {
        // make sure member actually exists before removing
        require(memberId[targetMember] != 0);

        // move member to the end of the members array STRANGE
        for (uint i = memberId[targetMember]; i < members.length-1; i++) {
            members[i] = members[i+1];
        }
        // delete members
        delete members[members.length-1];
        // decrease members.length by 1
        members.length--;
    }
}

