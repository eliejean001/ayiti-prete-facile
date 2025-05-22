
export interface LoanApplication {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  employment: string;
  employerName: string;
  employerPhone: string;
  employerAddress: string;
  reason: string;
  duration: number;
  amount: number;
  interestRate: number;
  email: string;
  signatureFullName: string;
  createdAt: Date;
  status: "pending" | "approved" | "rejected" | "reviewing";
  paymentStatus: "pending" | "paid";
  referenceName: string;
  referencePhone: string;
  referenceAddress: string;
}

export interface AdminUser {
  username: string;
  password: string;
}
