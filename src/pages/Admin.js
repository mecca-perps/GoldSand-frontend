import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { connectWallet } from "../app/mainSlice";
import { shortenAddress } from "../utils";

const Admin = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.main.walletAddress);
  const [balance, setBalance] = useState(0);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameContract, setGameContract] = useState(null);
  const [amount, setAmount] = useState(0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const init = async () => {
      dispatch(connectWallet);
      const provider = new ethers.providers.Web3Provider(
        window.coinbaseWalletExtension
      );
      const bal = await provider.getBalance(
        "0x8F10D74Bdf0F311851BDD021E1411093cD189623"
      );
      const balanceInEther = ethers.utils.formatEther(bal);
      setBalance(balanceInEther);
      const walletSigner = provider.getSigner(walletAddress);
      const contractAddress = "0x8F10D74Bdf0F311851BDD021E1411093cD189623";
      const contractAbi = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "addressArray",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "score",
              type: "uint256",
            },
          ],
          name: "calculateScore",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "distributeReward",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getPlayers",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "score",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "lastPlayed",
                  type: "uint256",
                },
              ],
              internalType: "struct GoldSand.Player[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getWinners",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "walletAddress",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "timestamp",
                  type: "uint256",
                },
              ],
              internalType: "struct GoldSand.Winner[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "lastWeekTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "players",
          outputs: [
            {
              internalType: "uint256",
              name: "score",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "lastPlayed",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "weekDuration",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "winnerArray",
          outputs: [
            {
              internalType: "address",
              name: "walletAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ];
      const contract = await new ethers.Contract(
        contractAddress,
        contractAbi,
        walletSigner
      );
      setGameContract(contract);
      const time = await contract.lastWeekTimestamp();
      const date = new Date(time.toNumber() * 1000);
      setYear(date.getFullYear());
      setMonth(monthNames[date.getMonth()]);
      setDay(date.getDate());
      setHours(date.getHours());
      setMinutes(date.getMinutes());
      setSeconds(date.getSeconds());
      return () => {};
    };

    init();
  }, []);

  const withdraw = async () => {
    try {
      await gameContract.withdraw(ethers.utils.parseEther(amount.toString()));
      toast.success("Withdrawal was successful");
    } catch (error) {
      console.log(error);
    }
  };

  const distribute = async () => {
    try {
      await gameContract.distributeReward();
      toast.success("Distribution was successful");
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async () => {
    dispatch(connectWallet());
  }

  return (
    <div className="admin-container">
      {walletAddress === undefined ? (
        <>
          <button
            id="connectWallet"
            className="connectWallet"
            onClick={connect}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <button className="connectWallet">
            {shortenAddress(walletAddress)}
          </button>
        </>
      )}
      <h1>Contract Balance</h1>
      <div>
        {balance} <span className="balance">ETH</span>
      </div>
      <h1>Last distribution date</h1>
      <div>
        {month} {day}, {year} , at {hours}:{minutes}:{seconds}
      </div>
      <div className="withdraw-container">
        <input
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <button className="admin-btn" onClick={withdraw}>
          Withdraw
        </button>
      </div>
      <div>
        <button className="admin-btn" onClick={distribute}>
          Distribute Reward
        </button>
      </div>
    </div>
  );
};

export default Admin;
