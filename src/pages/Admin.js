import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { connectWallet } from "../app/mainSlice";
import { shortenAddress } from "../utils";
import RotateLoader from "react-spinners/RotateLoader";
import axios from "axios";
import { gameAbi } from "../abi/gameAbi";
import { usdcAbi } from "../abi/usdcAbi";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Admin = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.main.walletAddress);
  const [balance, setBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameContract, setGameContract] = useState(null);
  const [amount, setAmount] = useState(0);
  const [usdcAmount, setUsdcAmount] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultPassword = process.env.REACT_APP_DEFAULT_PASSWORD;

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
      dispatch(connectWallet());
      const provider = new ethers.providers.Web3Provider(
        window.coinbaseWalletExtension
      );
      const contractAddress = process.env.REACT_APP_GAME_CONTRACT_ADDRESS;
      const bal = await provider.getBalance(contractAddress);
      const balanceInEther = ethers.utils.formatEther(bal);
      const walletSigner = provider.getSigner(walletAddress);
      const usdcContractAddress = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
      const usdcContract = new ethers.Contract(
        usdcContractAddress,
        usdcAbi,
        walletSigner
      );
      setBalance(balanceInEther);
      const usdcBal = await usdcContract.balanceOf(contractAddress);
      setUsdcBalance(ethers.utils.formatUnits(usdcBal, 6));
      const contract = await new ethers.Contract(
        contractAddress,
        gameAbi,
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

  const withdrawUSDC = async () => {
    try {
      const res = await gameContract.withdrawUSDC(
        ethers.utils.parseUnits(usdcAmount.toString(), 6)
      );
      if (res) {
        toast.success("withdrawl successful");
      }
    } catch (error) {}
  };

  const distribute = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/distributeReward`);
      if (res.data.message === "success") {
        toast.success("Distribution was successful");
      } else {
        toast.error("Distribution failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async () => {
    dispatch(connectWallet());
  };

  const checkAuth = async () => {
    if (password === defaultPassword) {
      setIsAuth(true);
      toast.success("success");
    } else {
      toast.error("wrong password");
      setPassword("");
    }
  };

  const handleKeyDown = async (event) => {
    if (event.keyCode === 13) {
      checkAuth();
    }
  };

  if (!isAuth) {
    return (
      <div className="admin-container">
        <div className="pwd-contanier">
          <span>Input password to go to admin page</span>
          <div className="input-container">
            <input
              className="pwd-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              className="admin-btn"
              style={{ width: "140px" }}
              onClick={checkAuth}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
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
      <h1>Last distribution date</h1>
      <div>
        {month} {day}, {year} , at {hours}:{minutes}:{seconds}
      </div>
      <h1>Contract Balance</h1>
      <div>
        <span className="balance">{balance}</span> ETH,{" "}
        <span className="balance">{usdcBalance}</span> USDC
      </div>
      <div className="withdraw-container">
        <input
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <button className="admin-btn withdraw" onClick={withdraw}>
          Withdraw ETH
        </button>
      </div>
      <div className="withdraw-container">
        <input
          onChange={(e) => {
            setUsdcAmount(e.target.value);
          }}
        />
        <button className="admin-btn withdraw" onClick={withdrawUSDC}>
          Withdraw USDC
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
