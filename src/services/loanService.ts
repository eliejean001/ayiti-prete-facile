
import { LoanApplication } from "../types/loan";
import { supabase } from "@/integrations/supabase/client";

// This will be called after successful payment
export const submitLoanApplication = async (application: Omit<LoanApplication, "id" | "createdAt" | "status" | "paymentStatus" | "interestRate">) => {
  const interestRate = calculateInterestRate(application.amount, application.duration);
  
  const { data, error } = await supabase
    .from('loan_applications')
    .insert({
      full_name: application.fullName,
      address: application.address,
      phone_number: application.phone,
      email: application.email,
      employment_status: application.employment,
      loan_purpose: application.reason,
      loan_duration: application.duration,
      loan_amount: application.amount,
      interest_rate: interestRate,
      signature: application.signatureFullName,
      payment_status: 'paid'
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error submitting loan application:", error);
    throw error;
  }
  
  // Map the Supabase data structure to our frontend model
  const newApplication: LoanApplication = {
    id: data.id,
    fullName: data.full_name,
    address: data.address,
    phone: data.phone_number,
    email: data.email,
    employment: data.employment_status || "",
    reason: data.loan_purpose,
    duration: data.loan_duration,
    amount: data.loan_amount,
    interestRate: data.interest_rate,
    signatureFullName: data.signature,
    createdAt: new Date(data.created_at),
    status: validateStatus(data.status),
    paymentStatus: validatePaymentStatus(data.payment_status)
  };
  
  console.log("New application submitted:", newApplication);
  return newApplication;
};

export const getAllApplications = async (): Promise<LoanApplication[]> => {
  console.log("Fetching all loan applications...");
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching loan applications:", error);
    throw error;
  }
  
  console.log("Fetched applications:", data);
  
  // Map the Supabase data structure to our frontend model
  return data.map(app => ({
    id: app.id,
    fullName: app.full_name,
    address: app.address,
    phone: app.phone_number,
    email: app.email,
    employment: app.employment_status || "",
    reason: app.loan_purpose,
    duration: app.loan_duration,
    amount: app.loan_amount,
    interestRate: app.interest_rate,
    signatureFullName: app.signature,
    createdAt: new Date(app.created_at),
    status: validateStatus(app.status),
    paymentStatus: validatePaymentStatus(app.payment_status)
  }));
};

export const getApplicationById = async (id: string): Promise<LoanApplication | undefined> => {
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error("Error fetching loan application:", error);
    return undefined;
  }
  
  // Map the Supabase data structure to our frontend model
  return {
    id: data.id,
    fullName: data.full_name,
    address: data.address,
    phone: data.phone_number,
    email: data.email,
    employment: data.employment_status || "",
    reason: data.loan_purpose,
    duration: data.loan_duration,
    amount: data.loan_amount,
    interestRate: data.interest_rate,
    signatureFullName: data.signature,
    createdAt: new Date(data.created_at),
    status: validateStatus(data.status),
    paymentStatus: validatePaymentStatus(data.payment_status)
  };
};

export const updateApplicationStatus = async (id: string, status: LoanApplication["status"]): Promise<LoanApplication | undefined> => {
  const { data, error } = await supabase
    .from('loan_applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating loan application status:", error);
    return undefined;
  }
  
  // Map the Supabase data structure to our frontend model
  return {
    id: data.id,
    fullName: data.full_name,
    address: data.address,
    phone: data.phone_number,
    email: data.email,
    employment: data.employment_status || "",
    reason: data.loan_purpose,
    duration: data.loan_duration,
    amount: data.loan_amount,
    interestRate: data.interest_rate,
    signatureFullName: data.signature,
    createdAt: new Date(data.created_at),
    status: validateStatus(data.status),
    paymentStatus: validatePaymentStatus(data.payment_status)
  };
};

export const updatePaymentStatus = async (id: string, paymentStatus: LoanApplication["paymentStatus"]): Promise<LoanApplication | undefined> => {
  const { data, error } = await supabase
    .from('loan_applications')
    .update({ payment_status: paymentStatus })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating payment status:", error);
    return undefined;
  }
  
  // Map the Supabase data structure to our frontend model
  return {
    id: data.id,
    fullName: data.full_name,
    address: data.address,
    phone: data.phone_number,
    email: data.email,
    employment: data.employment_status || "",
    reason: data.loan_purpose,
    duration: data.loan_duration,
    amount: data.loan_amount,
    interestRate: data.interest_rate,
    signatureFullName: data.signature,
    createdAt: new Date(data.created_at),
    status: validateStatus(data.status),
    paymentStatus: validatePaymentStatus(data.payment_status)
  };
};

// Helper functions to validate and cast string values to the required types
const validateStatus = (status: string): LoanApplication["status"] => {
  const validStatuses: LoanApplication["status"][] = ["pending", "approved", "rejected", "reviewing"];
  return validStatuses.includes(status as LoanApplication["status"]) 
    ? (status as LoanApplication["status"]) 
    : "pending";
};

const validatePaymentStatus = (paymentStatus: string): LoanApplication["paymentStatus"] => {
  const validPaymentStatuses: LoanApplication["paymentStatus"][] = ["pending", "paid"];
  return validPaymentStatuses.includes(paymentStatus as LoanApplication["paymentStatus"]) 
    ? (paymentStatus as LoanApplication["paymentStatus"]) 
    : "pending";
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
