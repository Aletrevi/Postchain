// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/// @title postchain
/// @notice You can use this contract for your JSONs notarization
/// @dev All function calls are currently implemented without side effects
contract postchain is Ownable {
    using SafeMath for uint256;

    struct Step {
        uint256 createdAt;
        string hashOfJson;
    }

    // COUNTERS
    uint256 public stepsCounter = 0;

    // STRUCT MAPPINGS
    mapping(uint256 => Step) public stepIdToStepInfo;
    mapping(string => uint256) public hashToId;
    event StepProofCreated(uint256 _id, string _hash);
    event StepProofRemoved(uint256 _id, string _hash);

    //Modifiers
    modifier noDuplicate(string memory _hashOfJson) {
        require(hashToId[_hashOfJson] == 0, "duplicate");
        _;
    }

    modifier exists(string memory _hashOfJson) {
        require(hashToId[_hashOfJson] != 0, "not exisisting");
        _;
    }

    /// @notice Notarizes a supply chain Step Proof
    /// @param _hashOfJson The hash proof of the JSON file
    /// @return The numeric ID of the Step proof
    function createStepProof(string calldata _hashOfJson)
        external
        onlyOwner
        noDuplicate(_hashOfJson)
        returns (uint256 stepID)
    {
        Step memory newStep = Step(now, _hashOfJson);
        stepsCounter = stepsCounter.add(1);
        stepIdToStepInfo[stepsCounter] = newStep;
        hashToId[_hashOfJson] = stepsCounter;
        emit StepProofCreated(stepsCounter, _hashOfJson);
        return stepsCounter;
    }

    function removeStepProof(string calldata _hashOfJson)
        external
        onlyOwner
        exists(_hashOfJson)
        returns (uint256 stepID)
    {
        uint256 hashId = hashToId[_hashOfJson];
        stepIdToStepInfo[hashId] = Step(now, "deleted");
        delete hashToId[_hashOfJson];
        emit StepProofRemoved(stepsCounter, _hashOfJson);
        return hashId;
    }
}