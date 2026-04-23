import { useWalletContext } from "../context/WalletContext";
import { signTransaction as freighterSignTransaction } from "@stellar/freighter-api";

export const useStellar = () => {
  return useWalletContext();
};

export const signTransaction = freighterSignTransaction;
