
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoanApplication from "./pages/LoanApplication";
import Payment from "./pages/Payment";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/demande" element={<LoanApplication />} />
              <Route path="/paiement" element={<Payment />} />
              <Route path="/payment-callback" element={<PaymentCallback />} />
              <Route path="/confirmation" element={<PaymentConfirmation />} />
              <Route path="/adminjaya-189087" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
