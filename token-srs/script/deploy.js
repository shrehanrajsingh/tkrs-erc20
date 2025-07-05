"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var viem_1 = require("viem");
var accounts_1 = require("viem/accounts");
var chains_1 = require("viem/chains");
var dotenv = require("dotenv");
var fs = require("fs");
var viem_2 = require("viem");
dotenv.config();
var privateKey = process.env.PRIVATE_KEY;
var rpcUrl = process.env.RPC_URL;
var localhost = (0, viem_2.defineChain)({
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
var artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/TokenSRS.sol/TokenSRS.json", "utf-8"));
var abi = artifact.abi;
var bytecode = artifact.bytecode;
var account = (0, accounts_1.privateKeyToAccount)(privateKey);
var client = (0, viem_1.createWalletClient)({
    account: account,
    chain: chains_1.sepolia,
    transport: (0, viem_1.http)(rpcUrl),
});
var publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.sepolia,
    transport: (0, viem_1.http)(rpcUrl),
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cap, hash, receipt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cap = (0, viem_1.parseEther)("1000000");
                    return [4 /*yield*/, client.deployContract({
                            abi: abi,
                            bytecode: bytecode,
                            args: [cap],
                        })];
                case 1:
                    hash = _a.sent();
                    console.log("Deployement hash: ".concat(hash));
                    return [4 /*yield*/, publicClient.waitForTransactionReceipt({ hash: hash })];
                case 2:
                    receipt = _a.sent();
                    if (receipt.contractAddress) {
                        console.log("Contract address: ".concat(receipt.contractAddress));
                        if (!fs.existsSync("./out")) {
                            fs.mkdirSync("./out", { recursive: true });
                            console.log("Created output directory './out'");
                        }
                        fs.writeFileSync("./out/deployed-address.json", JSON.stringify(receipt.contractAddress));
                        console.log("Contract address saved to deployed-address.json");
                    }
                    else {
                        console.log("Contract address not found in receipt.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.log("Deployment failed: ".concat(err));
});
