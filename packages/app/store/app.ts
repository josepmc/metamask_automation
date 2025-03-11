import { TokenInfo } from "@/types/token";
import Web3 from "web3";
import { create } from "zustand";

type AppStore = {
    web3: Web3 | null;
    accountAddress: string | null;
    contract: any;
    tokenAddress: string;
    tokenBalance: number;
    selectedToken: TokenInfo | null;
    getTokenBalanceFixed: () => number;
    getAmountOfSelectedToken: (_amount: number) => number;
    lastTransactionTime: number;
    setWeb3: (web3: Web3) => void;
    setAccountAddress: (accountAddress: string | null) => void;
    setContract: (contract: any) => void;
    setTokenAddress: (tokenAddress: string) => void;
    setSelectedToken: (tokenInfo: TokenInfo) => void;
    setTokenBalance: (tokenBalance: number) => void;
    setLastTransactionTime: (lastTransactionTime: number) => void;
};

export const useAppStore = create<AppStore>((set, get) => ({
    web3: null,
    accountAddress: null,
    contract: null,
    tokenAddress: "",
    tokenBalance: 0,
    selectedToken: null,
    getTokenBalanceFixed: () => !!get().selectedToken ? get().tokenBalance / 10** get().selectedToken!.decimals : get().tokenBalance,
    getAmountOfSelectedToken: (_amount: number) => !!get().selectedToken ? _amount * 10** get().selectedToken!.decimals : _amount,
    lastTransactionTime: 0,
    setWeb3: (web3: Web3) => set({ web3 }),
    setAccountAddress: (accountAddress: string | null) => set({ accountAddress }),
    setContract: (contract: any) => set({ contract }),
    setTokenAddress: (tokenAddress: string) => set({ tokenAddress }),
    setSelectedToken: (tokenInfo: TokenInfo) => set({ selectedToken: tokenInfo }),
    setTokenBalance: (tokenBalance: number) => set({ tokenBalance }),
    setLastTransactionTime: (lastTransactionTime: number) => set({ lastTransactionTime }),
}));
