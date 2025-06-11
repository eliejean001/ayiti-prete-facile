
import React, { useEffect, useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getAllApplications, deleteApplication } from '@/services/loanService';
import { updatePaymentStatusAsAdmin } from '@/services/adminLoanService';
import { LoanApplication } from '@/types/loan';
import { Download, CheckCircle2, Trash2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/hooks/use-toast';
import { getCurrentAdmin } from '@/services/authService';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const allApps = await getAllApplications();
      setApplications(allApps);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de prêt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
  };

  const handleMarkAsPaid = async (applicationId: string) => {
    setIsUpdating(true);
    try {
      const currentAdmin = getCurrentAdmin();
      
      if (!currentAdmin.isAuthenticated || !currentAdmin.id) {
        toast({
          title: "Erreur d'Authentification",
          description: "Session administrateur expirée. Veuillez vous reconnecter.",
          variant: "destructive"
        });
        return;
      }

      console.log("Marking application as paid with admin ID:", currentAdmin.id);
      
      const updatedApplication = await updatePaymentStatusAsAdmin(applicationId, 'paid', currentAdmin.id);
      
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
      console.error("Error marking as paid:", error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le statut de paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    setIsDeleting(applicationId);
    try {
      console.log("Starting deletion process for application:", applicationId);
      
      // Attempt to delete the application
      const success = await deleteApplication(applicationId);
      
      if (success) {
        console.log("Delete operation successful, updating UI");
        toast({
          title: "Demande Supprimée",
          description: "La demande de prêt a été supprimée avec succès.",
        });
        
        // Remove from local state only after successful deletion
        setApplications(prevApps => {
          const updatedApps = prevApps.filter(app => app.id !== applicationId);
          console.log("Updated applications list:", updatedApps.length, "applications remaining");
          return updatedApps;
        });
        
        // Clear selected application if it was deleted
        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication(null);
        }
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
      
      // Show specific error message to help with debugging
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de Suppression",
        description: `Impossible de supprimer la demande de prêt: ${errorMessage}`,
        variant: "destructive"
      });
      
      // If deletion failed, reload applications to ensure UI is in sync
      console.log("Reloading applications after failed deletion to ensure UI consistency");
      await loadApplications();
    } finally {
      setIsDeleting(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Tableau de Bord Administratif</h1>
      </div>

      {/* Applications List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Demandes de Prêt ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement des demandes...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune demande de prêt trouvée</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.fullName}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{formatCurrency(application.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status === 'approved' ? 'Approuvé' :
                           application.status === 'rejected' ? 'Rejeté' : 'En attente'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          application.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.paymentStatus === 'paid' ? 'Payé' :
                           application.paymentStatus === 'pending' ? 'En attente' : 'Non payé'}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(application.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                          >
                            Voir
                          </Button>
                          {application.paymentStatus !== 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(application.id)}
                              disabled={isUpdating}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Marquer Payé
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isDeleting === application.id}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer la demande de prêt de {application.fullName} ? 
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteApplication(application.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details */}
      {selectedApplication && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Détails de la Demande</CardTitle>
            <div className="flex gap-2">
              <Button onClick={downloadApplicationAsPdf} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
              <Button onClick={() => setSelectedApplication(null)} variant="outline">
                Fermer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div id="application-details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Informations Personnelles</h3>
                  <div className="space-y-2">
                    <p><strong>Nom Complet:</strong> {selectedApplication.fullName}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Téléphone:</strong> {selectedApplication.phone}</p>
                    <p><strong>Adresse:</strong> {selectedApplication.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Détails du Prêt</h3>
                  <div className="space-y-2">
                    <p><strong>Montant:</strong> {formatCurrency(selectedApplication.amount)}</p>
                    <p><strong>Durée:</strong> {selectedApplication.duration} mois</p>
                    <p><strong>Taux d'intérêt:</strong> {selectedApplication.interestRate}%</p>
                    <p><strong>Objectif:</strong> {selectedApplication.reason}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Informations Professionnelles</h3>
                  <div className="space-y-2">
                    <p><strong>Statut d'emploi:</strong> {selectedApplication.employment}</p>
                    <p><strong>Employeur:</strong> {selectedApplication.employerName}</p>
                    <p><strong>Téléphone employeur:</strong> {selectedApplication.employerPhone}</p>
                    <p><strong>Adresse employeur:</strong> {selectedApplication.employerAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Référence</h3>
                  <div className="space-y-2">
                    <p><strong>Nom:</strong> {selectedApplication.referenceName}</p>
                    <p><strong>Téléphone:</strong> {selectedApplication.referencePhone}</p>
                    <p><strong>Adresse:</strong> {selectedApplication.referenceAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Statut et Dates</h3>
                <div className="space-y-2">
                  <p><strong>Statut de la demande:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedApplication.status === 'approved' ? 'Approuvé' :
                       selectedApplication.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </p>
                  <p><strong>Statut de paiement:</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      selectedApplication.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedApplication.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedApplication.paymentStatus === 'paid' ? 'Payé' :
                       selectedApplication.paymentStatus === 'pending' ? 'En attente' : 'Non payé'}
                    </span>
                  </p>
                  <p><strong>Date de création:</strong> {formatDate(selectedApplication.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Signature</h3>
                <div className="border rounded p-4">
                  <p><strong>Nom du signataire:</strong> {selectedApplication.signatureFullName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
