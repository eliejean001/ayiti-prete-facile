import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
 // make sure this path is correct
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
        navigate('/admin'); // not logged in
        return;
      }

      const { data, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();

      if (data?.role !== 'admin') {
        navigate('/'); // not admin
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Demandes de Prêt</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Aucune demande de prêt pour le moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>{formatDate(app.createdAt)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplication(app)}
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Détails de la Demande</span>
              {selectedApplication && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadApplicationAsPdf}
                  >
                    <Download className="h-4 w-4 mr-2" /> Télécharger PDF
                  </Button>

                  {selectedApplication.paymentStatus === 'pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleMarkAsPaid(selectedApplication.id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent"></span>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Marquer comme payé
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedApplication ? (
              <p className="text-center text-gray-500 py-16">
                Sélectionnez une demande pour voir les détails.
              </p>
            ) : (
              <div id="application-details" className="p-4">
                {/* Your application details remain the same */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
