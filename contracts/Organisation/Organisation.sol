pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";
import "../utils/Motion.sol";


contract Organisation is PrivateOrg {
    // Contract Variables and events
    string public organisationName;
    

    event OrganisationNameChanged(string organisationName);

    /**
     * Constructor function
     * Needs _organisationName
     */
    function Organisation (
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
