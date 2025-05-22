
import { LoanApplication } from "../types/loan";
import { supabase } from "@/integrations/supabase/client";

// Define an interface for the database response to include all fields we're using
interface LoanApplicationDbResponse {
  id: string;
  full_name: string;
  address: string;
  phone_number: string;
  email: string;
  employment_status: string | null;
  employer: string | null;
  employer_phone: string | null;
  employer_address: string | null;
  reference_name: string | null;
  reference_phone: string | null;
  reference_address: string | null;
  job_title: string | null;
  loan_purpose: string;
  loan_duration: number;
  loan_amount: number;
  interest_rate: number;
  signature: string;
  created_at: string;
  status: string;
  payment_status: string;
  other_income_sources: string | null;
}

// This will now submit applications with pending payment status by default
export const submitLoanApplication = async (application: Omit<LoanApplication, "id" | "createdAt" | "status" | "paymentStatus">) => {
  console.log("Submitting application with payment status pending:", application);
  
  const { data, error } = await supabase
    .from('loan_applications')
    .insert({
      full_name: application.fullName,
      address: application.address,
      phone_number: application.phone,
      email: application.email,
      employment_status: application.employment,
      employer: application.employerName || null,
      employer_phone: application.employerPhone || null,
      employer_address: application.employerAddress || null,
      reference_name: application.referenceName || null,
      reference_phone: application.referencePhone || null,
      reference_address: application.referenceAddress || null,
      job_title: application.employment || null,
      loan_purpose: application.reason,
      loan_duration: application.duration,
      loan_amount: application.amount,
      interest_rate: application.interestRate,
      signature: application.signatureFullName,
      payment_status: 'pending', // Default to pending for admin verification
      other_income_sources: null
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
    employerName: data.employer || "",
    employerPhone: data.employer_phone || "",
    employerAddress: data.employer_address || "",
    reason: data.loan_purpose,
    duration: data.loan_duration,
    amount: data.loan_amount,
    interestRate: data.interest_rate,
    signatureFullName: data.signature,
    createdAt: new Date(data.created_at),
    status: validateStatus(data.status),
    paymentStatus: validatePaymentStatus(data.payment_status),
    referenceName: data.reference_name || "",
    referencePhone: data.reference_phone || "",
    referenceAddress: data.reference_address || ""
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
  return data.map((app: LoanApplicationDbResponse) => ({
    id: app.id,
    fullName: app.full_name,
    address: app.address,
    phone: app.phone_number,
    email: app.email,
    employment: app.employment_status || "",
    employerName: app.employer || "",
    employerPhone: app.employer_phone || "",
    employerAddress: app.employer_address || "",
    reason: app.loan_purpose,
    duration: app.loan_duration,
    amount: app.loan_amount,
    interestRate: app.interest_rate,
    signatureFullName: app.signature,
    createdAt: new Date(app.created_at),
    status: validateStatus(app.status),
    paymentStatus: validatePaymentStatus(app.payment_status),
    referenceName: app.reference_name || "",
    referencePhone: app.reference_phone || "",
    referenceAddress: app.reference_address || ""
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
  
  // Cast data to our known response type to handle the new fields
  const app = data as LoanApplicationDbResponse;
  
  // Map the Supabase data structure to our frontend model
  return {
    id: app.id,
    fullName: app.full_name,
    address: app.address,
    phone: app.phone_number,
    email: app.email,
    employment: app.employment_status || "",
    employerName: app.employer || "",
    employerPhone: app.employer_phone || "",
    employerAddress: app.employer_address || "",
    reason: app.loan_purpose,
    duration: app.loan_duration,
    amount: app.loan_amount,
    interestRate: app.interest_rate,
    signatureFullName: app.signature,
    createdAt: new Date(app.created_at),
    status: validateStatus(app.status),
    paymentStatus: validatePaymentStatus(app.payment_status),
    referenceName: app.reference_name || "",
    referencePhone: app.reference_phone || "",
    referenceAddress: app.reference_address || ""
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
  
  // Cast data to our known response type to handle the new fields
  const app = data as LoanApplicationDbResponse;
  
  // Map the Supabase data structure to our frontend model
  return {
    id: app.id,
    fullName: app.full_name,
    address: app.address,
    phone: app.phone_number,
    email: app.email,
    employment: app.employment_status || "",
    employerName: app.employer || "",
    employerPhone: app.employer_phone || "",
    employerAddress: app.employer_address || "",
    reason: app.loan_purpose,
    duration: app.loan_duration,
    amount: app.loan_amount,
    interestRate: app.interest_rate,
    signatureFullName: app.signature,
    createdAt: new Date(app.created_at),
    status: validateStatus(app.status),
    paymentStatus: validatePaymentStatus(app.payment_status),
    referenceName: app.reference_name || "",
    referencePhone: app.reference_phone || "",
    referenceAddress: app.reference_address || ""
  };
};

export const updatePaymentStatus = async (id: string, paymentStatus: LoanApplication["paymentStatus"]): Promise<LoanApplication | undefined> => {
  console.log(`Updating payment status for application ${id} to ${paymentStatus}`);
  
  try {
    // First check what the current status is to help with debugging
    const { data: currentData, error: checkError } = await supabase
      .from('loan_applications')
      .select('payment_status')
      .eq('id', id)
      .single();
      
    if (checkError) {
      console.error("Error checking current payment status:", checkError);
      console.error("Error details:", JSON.stringify(checkError, null, 2));
      throw checkError;
    }
    
    console.log("Current payment status in database:", currentData?.payment_status);
    
    // Now update the status
    // Important: We're mapping 'paid' to 'paid' but handling both 'pending' and 'unpaid' cases
    const dbPaymentStatus = paymentStatus === 'paid' ? 'paid' : 'pending';
    
    console.log(`Sending update to database with payment_status: ${dbPaymentStatus}`);
    
    const { data, error } = await supabase
      .from('loan_applications')
      .update({ payment_status: dbPaymentStatus })
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error updating payment status:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log("Payment status updated successfully:", data);
    
    // Cast data to our known response type to handle the new fields
    const app = data as LoanApplicationDbResponse;
    
    // Map the Supabase data structure to our frontend model
    return {
      id: app.id,
      fullName: app.full_name,
      address: app.address,
      phone: app.phone_number,
      email: app.email,
      employment: app.employment_status || "",
      employerName: app.employer || "",
      employerPhone: app.employer_phone || "",
      employerAddress: app.employer_address || "",
      reason: app.loan_purpose,
      duration: app.loan_duration,
      amount: app.loan_amount,
      interestRate: app.interest_rate,
      signatureFullName: app.signature,
      createdAt: new Date(app.created_at),
      status: validateStatus(app.status),
      paymentStatus: validatePaymentStatus(app.payment_status),
      referenceName: app.reference_name || "",
      referencePhone: app.reference_phone || "",
      referenceAddress: app.reference_address || ""
    };
  } catch (error) {
    console.error("Payment status update failed with exception:", error);
    throw error;
  }
};

// Helper functions to validate and cast string values to the required types
const validateStatus = (status: string): LoanApplication["status"] => {
  const validStatuses: LoanApplication["status"][] = ["pending", "approved", "rejected", "reviewing"];
  return validStatuses.includes(status as LoanApplication["status"]) 
    ? (status as LoanApplication["status"]) 
    : "pending";
};

const validatePaymentStatus = (paymentStatus: string): LoanApplication["paymentStatus"] => {
  // Handle both 'unpaid' (from DB) and 'pending' (from our frontend model) as the same state
  if (paymentStatus === 'unpaid') {
    console.log("Converting 'unpaid' from DB to 'pending' for frontend");
    return 'pending';
  }
  
  const validPaymentStatuses: LoanApplication["paymentStatus"][] = ["pending", "paid"];
  return validPaymentStatuses.includes(paymentStatus as LoanApplication["paymentStatus"]) 
    ? (paymentStatus as LoanApplication["paymentStatus"]) 
    : "pending";
};
