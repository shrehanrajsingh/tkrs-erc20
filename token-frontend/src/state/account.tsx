import { create } from "zustand";

const useAccount = create((set) => ({
  account: "",
  setAccount: () => set((state: any) => ({ account: state.account })),
}));

export default useAccount;
