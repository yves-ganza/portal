// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VibinPortal {

    struct User {
        string username;
        uint timeStamp;
    }

    struct Vibe {
        address owner;
        string message;
        uint timestamp;
    }

    mapping(address => User) addressToUser;
    Vibe[] vibes;
    uint256 userCount;

    address immutable admin;

    constructor(){
        console.log("Constructor...");
        admin = msg.sender;
    }

    function join(string memory _username) public returns(bool){
        string memory username = addressToUser[msg.sender].username;
        bool alreadyRegistered = bytes(username).length == bytes('').length;

        require(alreadyRegistered, 'error: User already registered');

        User memory newUser = User(_username, block.timestamp);
        addressToUser[msg.sender] = newUser;
        console.log('%s joined!', addressToUser[msg.sender].username);
        userCount += 1;
        return true;
    }

    function vibe(string memory _message) public{
        string memory username = addressToUser[msg.sender].username;
        bool alreadyRegistered = bytes(username).length != bytes('').length;

        require(alreadyRegistered || msg.sender == admin,'error: User not registered');

        Vibe memory newVibe = Vibe(
            msg.sender,
            _message,
            block.timestamp
        );

        vibes.push(newVibe);
        console.log('%s  just vibed with you', msg.sender);
    }

    function getVibes() public view returns(Vibe[] memory) {
        require(msg.sender == admin, 'error: Not authorized');
        return vibes;
    }

    function getUserCount() public view returns(uint256){
        require(msg.sender == admin, 'error: Not authorized');
        return userCount;
    }

}