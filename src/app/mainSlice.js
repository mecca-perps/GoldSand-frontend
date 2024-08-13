import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  walletAddress: undefined,
};

export const connectWallet = createAsyncThunk("connectWallet", async () => {
  let account;
  if (typeof window.coinbaseWalletExtension === "undefined") {
    toast.error("Please install coinbase wallet");
    return;
  } else {
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
  return account;
});

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectWallet.fulfilled, (state, action) => {
      console.log(action.payload);
      state.status = "succeeded";
      if (action.payload === undefined) return;
      state.walletAddress = action.payload;
    });
  },
});

// export const { connectWallet } = mainSlice.actions;

export default mainSlice.reducer;
