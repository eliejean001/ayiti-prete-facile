
import { LoanApplication } from "../types/loan";

// Mock database
let loanApplications: LoanApplication[] = [];

// Generate a simple ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// This will be called after successful payment
export const submitLoanApplication = (application: Omit<LoanApplication, "id" | "createdAt" | "status" | "paymentStatus" | "interestRate">) => {
  const newApplication: LoanApplication = {
    id: generateId(),
    ...application,
    createdAt: new Date(),
    status: "pending",
    paymentStatus: "paid", // Changed from "completed" to "paid" to match the type definition
    interestRate: calculateInterestRate(application.amount, application.duration)
  };
  
  loanApplications = [...loanApplications, newApplication];
  return newApplication;
};

export const getAllApplications = (): LoanApplication[] => {
  return [...loanApplications];
};

export const getApplicationById = (id: string): LoanApplication | undefined => {
  return loanApplications.find(app => app.id === id);
};

export const updateApplicationStatus = (id: string, status: LoanApplication["status"]): LoanApplication | undefined => {
  const index = loanApplications.findIndex(app => app.id === id);
  if (index !== -1) {
    loanApplications[index] = {
      ...loanApplications[index],
      status
    };
    return loanApplications[index];
  }
  return undefined;
};

export const updatePaymentStatus = (id: string, status: LoanApplication["paymentStatus"]): LoanApplication | undefined => {
  const index = loanApplications.findIndex(app => app.id === id);
  if (index !== -1) {
    loanApplications[index] = {
      ...loanApplications[index],
      paymentStatus: status
    };
    return loanApplications[index];
  }
  return undefined;
};

// Calculate interest rate based on amount and duration
const calculateInterestRate = (amount: number, duration: number): number => {
  // Base rate is 3%
  let rate = 3;
  
  // Higher amounts get higher rates
  if (amount > 250000) rate += 2;
  else if (amount > 100000) rate += 1;
  
  // Longer durations get higher rates
  if (duration > 24) rate += 3;
  else if (duration > 12) rate += 2;
  else if (duration > 6) rate += 1;
  
  // Cap at 10%
  return Math.min(rate, 10);
};
