/**
 * Form validation utilities for Soroban interactions.
 */
export const validateAmount = (amount: string, balance: number): string | null => {
  if (!amount || amount.trim() === "") {
    return "Amount is required.";
  }
  
  const val = parseFloat(amount);
  if (isNaN(val) || val <= 0) {
    return "Please enter a valid positive number.";
  }
  
  if (val > balance) {
    return `Insufficient balance. Max available: ${balance}`;
  }
  
  return null;
};

export const validateAddress = (address: string): boolean => {
  // Simple check for Stellar address format (G...)
  return /^G[A-Z2-7]{55}$/.test(address);
};
