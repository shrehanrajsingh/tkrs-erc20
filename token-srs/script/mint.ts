import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import * as dotenv from "dotenv";
import * as fs from "fs";
import contractAddress from "../out/deployed-address.json";

dotenv.config();

const rpcUrl = process.env.RPC_URL as string;

const localhost = defineChain({
  id: 31337,
  name: "localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } },
});

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const client = createWalletClient({
  account,
  chain: localhost,
  transport: http(rpcUrl),
});

const abi = JSON.parse(
  fs.readFileSync("./artifacts/contracts/TokenSRS.sol/TokenSRS.json", "utf-8")
).abi;

async function mintTokens(toAddress: `0x${string}`, amountEther: string) {
  const amount = parseEther(amountEther);

  try {
    const hash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "mint",
      args: [toAddress, amount],
    });

    console.log("Mint tx hash:", hash);
  } catch (error) {
    console.error("Mint failed:", error);
  }
}

// mintTokens("0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f", "1000");
