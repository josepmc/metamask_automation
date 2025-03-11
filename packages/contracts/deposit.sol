// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DepositContract {
 
    event Deposit(address indexed depositor, address indexed token, uint256 amount);

    function deposit(address tokenAddress, uint256 amount) external {
        // Ensure the caller has approved this contract to spend the specified amount of tokens
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        emit Deposit(msg.sender, tokenAddress, amount);
    }

}