# TKRS - ERC20 Token Project

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-gray.svg?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![Viem](https://img.shields.io/badge/Powered%20by-Viem-purple.svg)](https://viem.sh/)

## Overview

This is the official repository to develop, test and deploy TKRS. The project is open source, allowing anyone to modify the code to develop their own ERC20 token.

---

## Project Structure

| Directory | Description |
|-----------|-------------|
| `token-srs/` | **Backend of TKRS** <br> - Contains smart contracts and deployment scripts <br> - Built using Viem and Hardhat <br> - Contracts written in Solidity |
| `token-frontend/` | **Frontend Dashboard** <br> - User interface to interact with the token <br> - Functionality to mint, burn and transfer tokens <br> - Connects to blockchain via Web3 |

---

## Prerequisites

- Node.js and npm installed
- MetaMask wallet with Sepolia testnet ETH
- Account on [MetaMask developers](https://developers.metamask.io/) (formerly Infura)

## Environment Setup

### Backend Configuration

1. Navigate to the backend directory:
    ```bash
    cd token-srs/
    ```

2. Create environment file:
    ```bash
    cp .env.template .env
    ```

3. Edit `.env` with your credentials:
    ```
    PRIVATE_KEY=your_metamask_private_key_here
    RPC_URL=your_sepolia_rpc_url_here
    ```

### Frontend Configuration

1. Navigate to the frontend directory:
    ```bash
    cd token-frontend/
    ```

2. Create environment file:
    ```bash
    cp .env.template .env
    ```

3. Edit `.env` with RPC URL **only**:
    ```
    RPC_URL=your_sepolia_rpc_url_here
    ```

    > **IMPORTANT**: Never put your private key in the frontend environment file!

---

## Build and Deployment

### Backend Deployment

```bash
# Install dependencies
npm install

# Navigate to backend
cd token-srs

# Create output directory
mkdir out
touch deployed-address.json     # deployed contract address will be saved here

# Compile contracts
npx hardhat compile

# Deploy to network
node script/deploy.ts
```

### Frontend Setup

After deploying the backend:

1. Copy the ABI:
    ```bash
    # Copy the "abi" entry from:
    token-srs/artifacts/contracts/TokenSRS.sol/TokenSRS.json
    
    # And paste it into:
    token-frontend/abi.json
    ```

2. Launch the frontend:
    ```bash
    cd token-frontend
    npm run dev
    ```

---

## Troubleshooting

If you encounter any issues following these steps, please:

- [Open an issue](https://github.com/yourusername/tkrs/issues/new) on this repository
- Contact: [shrehanrajsingh.24@kgpian.iitkgp.ac.in](mailto:shrehanrajsingh.24@kgpian.iitkgp.ac.in)

---

## License

This project is open source and available under the [MIT License](LICENSE).