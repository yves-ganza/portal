// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VibinPortal {

    uint256 private seed;

    struct Avatar {
        string path;
        string cid;
        uint size;
    }

    struct User {
        string username;
        uint timeStamp;
        Avatar profilePic;
        uint rank;
    }

    struct Vibe {
        address owner;
        string username;
        string message;
        uint timestamp;
        uint upvotes;
        uint downvotes;
    }

    mapping(address => User) addressToUser;
    mapping(address => uint256) lastVibed;

    Vibe[] vibes;
    uint256 userCount;

    address immutable admin;

    constructor() payable{
        admin = msg.sender;
        seed = (block.timestamp + block.difficulty) % 100;
    }

    modifier onlyRegistered {
        string memory username = addressToUser[msg.sender].username;
        bool isRegistered = bytes(username).length != bytes('').length;
        require(isRegistered || msg.sender == admin, 'error: Not authorized');
        _;
    }

    function join(string memory _username, Avatar memory _avtr) public returns(bool){
        string memory username = addressToUser[msg.sender].username;
        bool alreadyRegistered = bytes(username).length != bytes('').length;

        require(!alreadyRegistered, 'error: User already registered');

        User memory newUser = User(_username, block.timestamp, _avtr, 0);
        addressToUser[msg.sender] = newUser;

        userCount += 1;
        return true;
    }

    function hasJoined() public view returns(bool){
        string memory username = addressToUser[msg.sender].username;
        bool isRegistered = bytes(username).length != bytes('').length;

        return isRegistered;
    }

    function getUser() public view returns(User memory){
        return addressToUser[msg.sender];
    }

    function vibe(string memory _message) payable onlyRegistered public{
        
        string memory username = addressToUser[msg.sender].username;
        
        Vibe memory newVibe = Vibe(
            msg.sender,
            username,
            _message,
            block.timestamp,
            0,
            0
        );

        vibes.push(newVibe);

        if(seed <= 50){
            require(lastVibed[msg.sender] + 15 minutes < block.timestamp, 'Too many requests');
            lastVibed[msg.sender] = block.timestamp;
            
            uint256 prize = 0.0001 ether;
            require(prize < address(this).balance, 'Unsufficient funds for prize');
            (bool success, ) = (msg.sender).call{value: prize}('');
            require(success, 'Failed to withdraw prize funds');
        }
    }

    function getVibes() onlyRegistered public view returns(Vibe[] memory) {
        return vibes;
    }

    function getUserCount() onlyRegistered public view returns(uint256){
        return userCount;
    }
}