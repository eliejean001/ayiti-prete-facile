
import { LoanApplication } from "../types/loan";
import { supabase } from "@/integrations/supabase/client";

// Admin-specific service for loan operations that bypasses RLS when needed
export const updatePaymentStatusAsAdmin = async (
  applicationId: string, 
  paymentStatus: LoanApplication["paymentStatus"],
  adminId: string
): Promise<LoanApplication | undefined> => {
  console.log(`Admin ${adminId} updating payment status for application ${applicationId} to ${paymentStatus}`);
  
  try {
    // First verify the admin ID is valid
    if (!adminId || adminId.trim() === '') {
      throw new Error("Invalid admin ID provided");
    }
    
    // Verify admin exists and has proper role
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', adminId)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (adminError) {
      console.error("❌ Admin verification failed:", adminError);
      throw new Error(`Admin verification failed: ${adminError.message}`);
    }
    
    if (!adminData) {
      console.error("❌ Admin not found or invalid role for ID:", adminId);
      throw new Error("Unauthorized: Invalid admin credentials or insufficient permissions");
    }
    
    console.log("✅ Admin verified:", adminData);

    // Map frontend payment status to database payment status
    const dbPaymentStatus = paymentStatus === 'paid' ? 'paid' : 'pending';
    
    console.log(`Updating database with payment_status: ${dbPaymentStatus}`);
    
    // Perform the update - this should work now with the proper RLS policy
    const { data, error } = await supabase
      .from('loan_applications')
      .update({ 
        payment_status: dbPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select('*')
      .single();
      
    if (error) {
      console.error("❌ Error updating payment status:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
    
    console.log("✅ Payment status updated successfully:", data);
    
    // Map the response back to our frontend model
    const app = data as any;
    
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
    console.error("❌ Payment status update failed with exception:", error);
    throw error;
  }
};

// Helper functions
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
