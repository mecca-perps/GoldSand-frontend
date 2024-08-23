import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

const initialState = {
  walletAddress: undefined,
  score: 0,
};

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const connectWallet = createAsyncThunk("connectWallet", async () => {
  let account;
  if (typeof window.coinbaseWalletExtension === "undefined") {
    toast.error("Please install coinbase wallet");
    return;
  } else {
    const chainId = await window.coinbaseWalletExtension.request({
      method: "eth_chainId",
    });
    if (chainId !== "0x2105") {
      try {
        await window.coinbaseWalletExtension.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
        });
        toast.success("Changed network to Base");
      } catch (error) {
        console.log(error);
      }
    }

    const accounts = await window.coinbaseWalletExtension.request({
      method: "eth_accounts",
    });
    if (accounts.length > 0) {
      account = accounts[0];
    } else {
      const accounts = await window.coinbaseWalletExtension.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];
    }
  }
  const param = {
    walletAddress: account,
  };
  const res = await axios.post(`${SERVER_URL}/getScore`, param);
  if (res.data.message === "success") {
    return {
      score: res.data.score,
      account,
    };
  } else {
    return {
      score: 0,
      account,
    };
  }
});

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    changeScore: (state, action) => {
      state.score = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectWallet.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload === undefined) return;
      state.walletAddress = action.payload.account;
      state.score = action.payload.score;
    });
  },
});

export const { changeScore } = mainSlice.actions;

export default mainSlice.reducer;
