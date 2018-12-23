pragma solidity ^0.4.24;

contract Votation {
    struct Candidate {
        uint id;
        string name;
        uint count;
    }

    uint public candidateCount;
    address public owner;

    constructor() public {
        owner = msg.sender;
        addCandidate("Andy");
        addCandidate("Jack");
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier notOwner {
        require(msg.sender != owner);
        _;
    }

    mapping(uint => Candidate) public candidates;
    function addCandidate(string memory name) onlyOwner public {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }

    // record whether a account has voted or not.
    mapping(address => bool) public hasVoted;
    function vote(uint id) notOwner public {
        require(!hasVoted[msg.sender]);

        require(id >=1 && id <= candidateCount);

        hasVoted[msg.sender] = true;

        candidates[id].count++;
    }
}