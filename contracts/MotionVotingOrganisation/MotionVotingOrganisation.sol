pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";
import "../utils/Motion.sol";


contract MotionVotingOrganisation is PrivateOrg {
    // Contract Variables and events
    string public organisationName;
    Motion[] public motions;
    uint public numberOfMotions;

    // motion "object structure
    struct Motion {
        string motionTitle;
        string motionAbstract;
        bool motionPassed;
        Option[] options;
        uint numberOfOptions;
        mapping (address => bool) voted;
        Vote[] votes;
        uint votingDeadline;
        uint minimumQuorum;
        uint majorityPercentage;
    }

    // option "object" structure
    struct Option {
        string name;
        int voteValue;
        bool isVotePositive;
        int numberOfVotes;
    }

    struct Vote {
        uint optionID;
        address voter;
    }
    
    // events
    event OrganisationNameChanged(string organisationName);

    /**
     * Constructor function
     * Needs _organisationName
     */
    function MotionVotingOrganisation (
        string _organisationName
    ) public {
        // set voting rules at contract initialisation
        organisationName = _organisationName;
    }

    /**
     * Change organisation name
     * 
     * takes newOrganisationName
     * 
     * modified with onlyOwner
     */
    function changeOrganisationName(
        string newOrganisationName
    ) public onlyOwner {
        organisationName = newOrganisationName;

        // fire ChangeOfRules event
        OrganisationNameChanged(newOrganisationName);
    }

    
}
