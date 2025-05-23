import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { logoutAdmin } from '@/services/authService';
import { getAllApplications, updatePaymentStatus } from '@/services/loanService';
import { LoanApplication } from '@/types/loan';
import { Download, LogOut, CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user) {
        navigate('/admin');
        return;
      }

      const { data, error: roleError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      const adminData = data as unknown as {
        role: string;
      };

      if (!adminData || adminData.role !== 'admin') {
        navigate('/');
        return;
      }

      loadApplications();
      setCheckingRole(false);
    };

    checkAdminRole();
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const allApps = await getAllApplications();
      setApplications(allApps);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de prêt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
  };

  const handleMarkAsPaid = async (applicationId: string) => {
    setIsUpdating(true);
    try {
      const updatedApplication = await updatePaymentStatus(applicationId, 'paid');
      if (updatedApplication) {
        toast({
          title: "Paiement Confirmé",
          description: "Le statut de paiement a été mis à jour avec succès.",
        });
        setApplications(apps => apps.map(app =>
          app.id === applicationId ? { ...app, paymentStatus: 'paid' } : app
        ));
        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication({ ...selectedApplication, paymentStatus: 'paid' });
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de paiement.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadApplicationAsPdf = () => {
    if (!selectedApplication) return;
    const applicationHTML = document.getElementById('application-details');
    if (!applicationHTML) return;

    const pdfOptions = {
      margin: 10,
      filename: `demande-pret-${selectedApplication.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(pdfOptions).from(applicationHTML).save();
    toast({
      title: "Téléchargement",
      description: "Le PDF a été téléchargé avec succès",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (checkingRole) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Tableau de Bord Administratif</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Déconnexion
        </Button>
      </div>
      {/* Your application list and details section remains unchanged here */}
    </div>
  );
};

export default AdminDashboard;
