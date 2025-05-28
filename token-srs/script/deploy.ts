import { createWalletClient, createPublicClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import * as fs from "fs";

import { defineChain } from "viem";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
const rpcUrl = process.env.RPC_URL as string;

const localhost = defineChain({
  id: 31337,
  name: "localhost",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
});

const artifact = JSON.parse(
  fs.readFileSync("./artifacts/contracts/TokenSRS.sol/TokenSRS.json", "utf-8")
);

const abi = artifact.abi;
const bytecode = artifact.bytecode;

const account = privateKeyToAccount(privateKey);
const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

async function main() {
  const cap = parseEther("1000000");

  const hash = await client.deployContract({
    abi,
    bytecode,
    args: [cap],
  });

  console.log(`Deployement hash: ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.contractAddress) {
    console.log(`Contract address: ${receipt.contractAddress}`);
    if (!fs.existsSync("./out")) {
      fs.mkdirSync("./out", { recursive: true });
      console.log("Created output directory './out'");
    }
    fs.writeFileSync(
      "./out/deployed-address.json",
      JSON.stringify(receipt.contractAddress)
    );
    console.log("Contract address saved to deployed-address.json");
  } else {
    console.log("Contract address not found in receipt.");
  }
}

main().catch((err) => {
  console.log(`Deployment failed: ${err}`);
});
