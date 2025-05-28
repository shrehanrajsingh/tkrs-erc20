// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSRS is ERC20Capped, ERC20Burnable, Ownable {
    bool private _destroyed = false;

    constructor(
        uint256 cap
    ) ERC20("TokenSRS", "TKRS") ERC20Capped(cap) Ownable(msg.sender) {}

    modifier notDestroyed() {
        require(!_destroyed, "Contract is destroyed");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner notDestroyed {
        _mint(to, amount);
    }

    function closeContract() external onlyOwner {
        _destroyed = true;
        payable(owner()).transfer(address(this).balance);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
