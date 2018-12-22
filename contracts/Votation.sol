pragma solidity ^0.5.0;

contract Votation {
    struct Candidate {
        uint id;
        string name;
        uint count;
    }

    uint candidateCount;
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier notOwner {
        require(msg.sender != owner);
        _;
    }

    mapping(uint => Candidate) candidates;
    function addCandidate(string memory name) onlyOwner public {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }

    // record whether a account has voted or not.
    mapping(address => bool) hasVoted;
    function vote(uint id) notOwner public {
        require(!hasVoted[msg.sender]);

        require(id >=1 && id <= candidateCount);

        hasVoted[msg.sender] = true;

        candidates[id].count++;
    }
}