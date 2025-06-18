import { useState } from "react";
import AddAccountStep1PNG from "./assets/add-account-step-1.png";
import AddAccountStep2PNG from "./assets/add-account-step-2.png";
import AddAccountStep3PNG from "./assets/add-account-step-3.png";
import AddAccountStep4PNG from "./assets/add-account-step-4.png";
import AddAccountStep5PNG from "./assets/add-account-step-5.png";

import React, { useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  formatEther,
  http,
  parseEther,
} from "viem";
import { mint, sepolia } from "viem/chains";
import tokenAbi from "./abi.json";

import tokenAddress from "../../token-srs/out/deployed-address.json";
import { toast, ToastContainer } from "react-toastify";

const rpcUrl = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

export default function Dashboard({
  allAccounts,
  setAllAccounts,
  account,
  setAccount,
  walletClient,
  setWalletClient,
  publicClient,
  setPublicClient,
  balance,
  setBalance,
  symbol,
  setSymbol,
}: {
  allAccounts: Array<string> | null;
  setAllAccounts: any;
  account: string;
  setAccount: any;
  walletClient: any;
  setWalletClient: any;
  publicClient: any;
  setPublicClient: any;
  balance: any;
  setBalance: any;
  symbol: any;
  setSymbol: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mintAmount, setMintAmount] = useState<Number>(0);
  const [burnAmount, setBurnAmount] = useState<Number>(0);
  const [td, setTD] = useState<{
    recipient: string;
    amount: string;
  }>({
    recipient: "",
    amount: "",
  });

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

  async function mintTokens(amount: Number) {
    if (!walletClient || !account) return alert("Wallet not connected");

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "mint",
        args: [account, parseEther(amount.toString())],
      });

      toast.info(<>Mint tx sent: {hash}</>);

      // fetchBalance();
    } catch (e: any) {
      console.log(e);
      toast.error("Mint failed: " + e.shortMessage || e.message);
    } finally {
      setTimeout(fetchBalance, 5000);
    }
  }

  async function burnTokens(amount: Number) {
    if (!walletClient) return alert("Wallet not connected");

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "burn",
        args: [parseEther(amount.toString())],
      });
      toast.info(<>Burn tx sent: {hash}</>);
    } catch (e: any) {
      console.log(e);

      toast.error("Burn failed: " + e.shortMessahe || e.message);
    } finally {
      setTimeout(fetchBalance, 5000);
    }
  }

  async function transferTokens() {
    if (!walletClient || !account) return alert("Wallet not connected");

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "transfer",
        args: [td.recipient, parseEther(td.amount)],
        account,
        symbol,
      });

      toast.success(<>Transfer sent: {hash}</>);
    } catch (e: any) {
      console.error(e);
      toast.error("Transfer failed: " + e.shortMessage || e.message);
    } finally {
      setTimeout(fetchBalance, 5000);
    }
  }

  return (
    <div className="p-4">
      <div className="p-4">
        <nav className="w-full h-12 bg-gradient-to-t from-gray-800 to-slate-800 rounded-xl border border-gray-600 mb-4 flex items-center px-4 py-2 align-middle">
          <h1 className="font-agile translate-y-1 text-slate-300 text-2xl w-full text-center md:text-left md:w-fit">
            TKRS
          </h1>

          <div className="flex-1 md:flex justify-center hidden">
            <div className="flex space-x-8 items-center align-middle text-sm">
              <a
                href="#docs"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Docs
              </a>
              <a
                href="https://github.com/your-repo/token"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="#tokenomics"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Tokenomics
              </a>
              <a
                href="#community"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Community
              </a>
              <a
                href="#contribute"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Contribute
              </a>
              <div className="hidden lg:block">
                <a
                  href="#whitepaper"
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Whitepaper
                </a>
              </div>
              <div className="hidden xl:block">
                <a
                  href="#roadmap"
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Roadmap
                </a>
              </div>
              <div className="relative group lg:ml-2">
                <button className="text-slate-300 hover:text-white transition-colors duration-200 translate-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <a
                    href="#faq"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700"
                  >
                    FAQ
                  </a>
                  <a
                    href="#team"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700"
                  >
                    Team
                  </a>
                  <a
                    href="#audit"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700"
                  >
                    Audit
                  </a>
                  <a
                    href="#governance"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700"
                  >
                    Governance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 md:gap-0 md:min-h-[80vh]">
          <div className="col-span-1 md:col-span-2 mb-4 md:mb-0 md:mr-4">
            <div className="w-full h-full bg-gradient-to-t from-gray-800 to-slate-800 rounded-xl border border-gray-600 px-4 sm:px-6 pt-6 text-slate-300">
              <div>
                <h1 className="text-sm text-slate-400 tracking-wider cursor-default">
                  METAMASK ACCOUNTS
                </h1>
                <div className="w-12 h-1 rounded mt-1 bg-slate-400"></div>

                <div className="mt-4">
                  {allAccounts?.map((val: any, key: any) => (
                    <div
                      key={key}
                      onClick={() => setAccount(val)}
                      className={`flex items-center p-2 sm:p-3 my-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        account === val
                          ? "bg-indigo-700 text-white"
                          : "hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex-shrink-0 mr-2 sm:mr-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{key + 1}</span>
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-mono text-xs sm:text-sm truncate">
                          {val.substring(0, 6)}...
                          {val.substring(val.length - 4)}
                        </p>
                        {account === val && (
                          <p className="text-xs text-indigo-200 mt-1">
                            Current Account
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full p-2 sm:p-3 my-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Account
                  </button>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-3 sm:p-6 rounded-lg w-full max-w-lg border border-gray-600 overflow-y-auto max-h-[80vh] sm:max-h-[90vh]">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-white">
                          Add a MetaMask Account
                        </h2>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-slate-300">
                        <h3 className="font-semibold mb-2">
                          Follow these steps:
                        </h3>
                        <ol className="list-decimal list-inside space-y-2">
                          <li className="text-xs sm:text-sm mb-4">
                            Open your MetaMask extension
                            <img
                              src={AddAccountStep1PNG}
                              className="w-full h-auto rounded-2xl m-2 border border-slate-400"
                            />
                          </li>
                          <li className="text-xs sm:text-sm mb-4">
                            Open the account you wish to connect. (Create/Import
                            an account if it does not exist)
                            <img
                              src={AddAccountStep2PNG}
                              className="w-full h-auto rounded-2xl m-2 border border-slate-400"
                            />
                          </li>
                          <li className="text-xs sm:text-sm mb-4">
                            Click on the web icon at the top right beside the
                            three dots.
                            <img
                              src={AddAccountStep3PNG}
                              className="w-full h-auto rounded-2xl m-2 border border-slate-400"
                            />
                          </li>
                          <li className="text-xs sm:text-sm mb-4">
                            Click Edit near See your accounts and suggest
                            transactions
                            <img
                              src={AddAccountStep4PNG}
                              className="w-full h-auto rounded-2xl m-2 border border-slate-400"
                            />
                          </li>
                          <li className="text-xs sm:text-sm mb-4">
                            Add the account to this website and click update
                            <img
                              src={AddAccountStep5PNG}
                              className="w-full h-auto rounded-2xl m-2 border border-slate-400"
                            />
                          </li>
                          <li className="text-xs sm:text-sm mb-4">
                            Once added, refresh this page to see your new
                            account
                          </li>
                        </ol>
                        <div className="mt-6">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                          >
                            Got it
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-6">
            <div className="w-full h-full bg-gradient-to-t from-gray-800 to-slate-800 rounded-xl border border-gray-600">
              <div className="p-6 text-slate-300 h-full flex flex-col">
                {account ? (
                  <>
                    <div className="mb-6">
                      <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                        Account Dashboard
                      </h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-900/40 rounded-full text-xs md:text-sm font-mono">
                          {account}
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(account)}
                          className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                          title="Copy address"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-600 p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-white">
                            Token Balance
                          </h2>
                          <button
                            onClick={async () => {
                              try {
                                fetchBalance();
                              } catch (error) {
                                console.error(error);
                              }
                            }}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                            title="Refresh balance"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-3xl w-full font-bold text-white break-words overflow-wrap-anywhere">
                            {balance || "0.00"}
                            <span className="ml-2 text-lg text-indigo-300">
                              {symbol || "Tokens"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <div className="mt-3 pt-2 border-t border-slate-600">
                            <div className="text-xs text-slate-400 grid grid-cols-2 gap-x-2 gap-y-1">
                              <span className="text-slate-500">
                                Amount: (formatted)
                              </span>
                              <span>
                                {formatEther(balance)} {symbol || "Tokens"}
                              </span>
                              <span className="text-slate-500">
                                Token Address:
                              </span>
                              <div className="flex items-center">
                                <span
                                  className="font-mono truncate"
                                  title={tokenAddress}
                                >
                                  {tokenAddress.substring(0, 6)}...
                                  {tokenAddress.substring(
                                    tokenAddress.length - 4
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    navigator.clipboard.writeText(tokenAddress)
                                  }
                                  className="ml-1 p-0.5 hover:bg-slate-700 rounded-full transition-colors"
                                  title="Copy address"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                  </svg>
                                </button>
                              </div>
                              <span className="text-slate-500">Network:</span>
                              <span>Sepolia</span>
                              <span className="text-slate-500">Decimals:</span>
                              <span>18</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-600 p-5 shadow-lg">
                        <h2 className="text-lg font-semibold text-white mb-4">
                          Send Tokens
                        </h2>
                        <form
                          className="space-y-3"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Recipient Address
                            </label>
                            <input
                              type="text"
                              placeholder="0x..."
                              onChange={(e: any) =>
                                setTD({ ...td, recipient: e.target.value })
                              }
                              id="sendtokensaddress"
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Amount
                            </label>
                            <input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              onChange={(e: any) =>
                                setTD({ ...td, amount: e.target.value })
                              }
                              id="sendtokensamount"
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors font-medium"
                            onClick={() => {
                              try {
                                transferTokens();
                              } catch (error) {
                                console.log(error);
                              } finally {
                                const stAddress = document.getElementById(
                                  "sendtokensaddress"
                                ) as HTMLInputElement;
                                if (stAddress) {
                                  stAddress.value = "";
                                }

                                const stAmount = document.getElementById(
                                  "sendtokensamount"
                                ) as HTMLInputElement;
                                if (stAmount) {
                                  stAmount.value = "";
                                }
                              }
                            }}
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-900/40 to-slate-800 rounded-xl border border-green-800/40 p-5 shadow-lg">
                        <h2 className="text-lg font-semibold text-white mb-4">
                          Mint Tokens
                        </h2>
                        <form
                          className="space-y-3"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Amount to Mint
                            </label>
                            <input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              onChange={(e: any) =>
                                setMintAmount(e.target.value)
                              }
                              id="mintamount"
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium"
                            onClick={() => {
                              try {
                                mintTokens(mintAmount);
                              } catch (error) {
                                console.log(error);
                                toast.error("Error occurred while minting.");
                              } finally {
                                setMintAmount(0);
                                const mintInput = document.getElementById(
                                  "mintamount"
                                ) as HTMLInputElement;
                                if (mintInput) {
                                  mintInput.value = "";
                                }
                              }
                            }}
                          >
                            Mint Tokens
                          </button>
                        </form>
                      </div>

                      <div className="bg-gradient-to-br from-red-900/40 to-slate-800 rounded-xl border border-red-800/40 p-5 shadow-lg">
                        <h2 className="text-lg font-semibold text-white mb-4">
                          Burn Tokens
                        </h2>
                        <form
                          className="space-y-3"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Amount to Burn
                            </label>
                            <input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              onChange={(e: any) =>
                                setBurnAmount(e.target.value)
                              }
                              id="burnamount"
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <button
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors font-medium"
                            onClick={() => {
                              try {
                                burnTokens(burnAmount);
                              } catch (error) {
                                console.log(error);
                              } finally {
                                setBurnAmount(0);
                                const burnInput = document.getElementById(
                                  "burnamount"
                                ) as HTMLInputElement;
                                if (burnInput) {
                                  burnInput.value = "";
                                }
                              }
                            }}
                          >
                            Burn Tokens
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center p-8 max-w-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-indigo-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h2 className="text-xl font-bold text-white mb-2">
                        No Account Selected
                      </h2>
                      <p className="text-slate-400 mb-6">
                        Please select an account from the sidebar to view your
                        dashboard and manage your tokens.
                      </p>
                      <div className="animate-pulse text-indigo-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}
