import React, { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains";
import tokenAbi from "./abi.json";

import tokenAddress from "../../token-srs/out/deployed-address.json";
import { toast, ToastContainer } from "react-toastify";

import MetaMaskSVG from "../public/metamask-icon.svg";
import BitcoinLogoSVG from "../public/bitcoin-btc-logo.svg";
import AvalancheSVG from "../public/avalanche-avax-logo.svg";
import EthereumSVG from "../public/ethereum-eth-logo.svg";
import SolanaSVG from "../public/solana-sol-logo.svg";
import Dashboard from "./Dashboard";

import useAccount from "./state/account";

import AddAccountStep1PNG from "./assets/add-account-step-1.png";
import AddAccountStep2PNG from "./assets/add-account-step-2.png";
import AddAccountStep3PNG from "./assets/add-account-step-3.png";
import AddAccountStep4PNG from "./assets/add-account-step-4.png";
import AddAccountStep5PNG from "./assets/add-account-step-5.png";

const rpcUrl = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

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
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
});

export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [allAccounts, setAllAccounts] = useState<Array<string> | null>(null);

  const [balance, setBalance] = useState<string>("0");
  const [symbol, setSymbol] = useState<string>("");
  const [walletClient, setWalletClient] = useState<any>(null);
  const [publicClient, setPublicClient] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function connectWallet() {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        setAllAccounts(accounts);
        setAccount(accounts[0]);

        const wc = createWalletClient({
          chain: sepolia,
          transport: custom((window as any).ethereum),
          account: accounts[0],
        });
        setWalletClient(wc);

        const pc = createPublicClient({
          chain: sepolia,
          transport: http(rpcUrl),
        });
        setPublicClient(pc);
      } catch (err) {
        toast.error("Connecting wallet failed");
      }
    } else {
      toast.warn("Please install MetaMask!");
    }
  }

  async function fetchSymbol() {
    if (!publicClient) return;
    const sym = await publicClient.readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "symbol",
    });
    setSymbol(sym);
  }

  async function fetchBalance() {
    if (!publicClient || !account) return;
    const bal = await publicClient.readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "balanceOf",
      args: [account],
    });
    setBalance(bal.toString());
  }

  async function mintTokens() {
    if (!walletClient || !account) return alert("Wallet not connected");

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "mint",
        args: [account, parseEther("10")],
      });
      toast.info("Mint tx sent: " + hash);
      fetchBalance();
    } catch (e: any) {
      // toast.error(
      //   "Mint failed: " +
      //     (e.toString().includes("UnauthorizedAccount")
      //       ? "Permission denied"
      //       : e)
      // );
      console.log(e);
    }
  }

  async function burnTokens() {
    if (!walletClient) return alert("Wallet not connected");

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "burn",
        args: [parseEther("5")],
      });
      toast.info("Burn tx sent: " + hash);
      fetchBalance();
    } catch (e: any) {
      console.log(e);

      // toast.error(
      //   "Burn failed: " +
      //     (e.toString().includes("Insufficient") ? "Insufficient funds" : e)
      // );
    }
  }

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchSymbol();
    }
  }, [account, publicClient]);

  // useEffect(() => {
  //   // connectWallet();
  //   if (account && publicClient) {
  //     const intervalId = setInterval(() => {
  //       fetchBalance();
  //     }, 1500);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [account, publicClient]);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-gray-900 to-slate-900 overflow-y-scroll max-h-[100vh]">
      {!account ? (
        <div className="w-full h-screen flex flex-col items-center justify-center text-slate-300">
          <div className="absolute top-0 left-0 w-full h-screen grid grid-cols-1 sm:grid-cols-2">
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={BitcoinLogoSVG}
                alt=""
                className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 opacity-40 grayscale animate-floating-obj2"
              />
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={EthereumSVG}
                alt=""
                className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 opacity-40 grayscale animate-floating-obj"
              />
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={SolanaSVG}
                alt=""
                className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 opacity-40 grayscale animate-floating-obj2"
              />
            </div>
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={AvalancheSVG}
                alt=""
                className="h-20 w-20 sm:h-28 sm:w-28 md:h-40 md:w-40 opacity-40 grayscale animate-floating-obj"
              />
            </div>
          </div>
          <nav className="absolute top-0 left-0 right-0 flex justify-center items-center p-2 sm:p-3 md:p-4 z-50 bg-transparent">
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
              {["Develop", "Contribute", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs sm:text-sm md:text-base text-slate-300 hover:text-white tracking-wide 
            relative group transition-all duration-300 ease-in-out px-1 sm:px-2 py-1"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </nav>
          <div className="relative group mt-12 sm:mt-8 md:mt-0">
            <p
              className="py-2 px-3 sm:py-3 sm:px-6 md:py-4 md:px-8 cursor-default text-xs sm:text-sm md:text-base 
              bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 text-slate-700 font-medium
              rounded-3xl backdrop-blur-sm border border-emerald-400/20
              shadow-lg shadow-emerald-900/30 tracking-wide
              hover:shadow-xl hover:shadow-emerald-800/40 hover:-translate-y-1
              transition-all duration-300 ease-in-out
              transform hover:scale-105 animate-pulse-slow"
            >
              An open source{" "}
              <span
                className="font-bold bg-gradient-to-tr from-indigo-400 to-purple-500 text-transparent bg-clip-text 
          relative inline-block group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300"
              >
                ERC20
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </span>{" "}
              <span className="hidden sm:inline">Token initiative</span>
              <span className="inline sm:hidden">Token</span>
            </p>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h1 className="font-agile text-6xl sm:text-9xl md:text-[12rem] lg:text-[16rem] my-4 sm:my-6">
            TKRS
          </h1>
          <button
            onClick={connectWallet}
            className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3
              text-sm sm:text-base md:text-xl font-medium tracking-wide
              text-orange-50 bg-gradient-to-br from-orange-500/80 to-amber-700/80
              hover:from-orange-400 hover:to-amber-600
              border border-orange-400/50 rounded-xl
              shadow-md shadow-orange-900/30 hover:shadow-xl hover:shadow-orange-600/40
              backdrop-filter backdrop-blur-sm
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-1
              relative overflow-hidden outline-offset-0"
          >
            <span className="z-10 flex items-center">
              Connect MetaMask
              <img
                src={MetaMaskSVG}
                alt="MetaMask"
                width={28}
                height={28}
                className="ml-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </span>
            <span className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      ) : (
        <>
          {/* <h3>Connected Account: {account}</h3>
          <p>Token Symbol: {symbol}</p>
          <p>Balance: {balance}</p>
          <button onClick={mintTokens}>Mint 10 Tokens</button>
          <button onClick={burnTokens}>Burn 5 Tokens</button>
          <ToastContainer autoClose={1000} position="top-right" /> */}

          {/* I hope someday I migrate it to a global state */}
          <Dashboard
            allAccounts={allAccounts}
            setAllAccounts={setAllAccounts}
            account={account}
            setAccount={setAccount}
            walletClient={walletClient}
            setWalletClient={setWalletClient}
            publicClient={publicClient}
            setPublicClient={setPublicClient}
            balance={balance}
            setBalance={setBalance}
            symbol={symbol}
            setSymbol={setSymbol}
          />
        </>
      )}
    </div>
  );
}
