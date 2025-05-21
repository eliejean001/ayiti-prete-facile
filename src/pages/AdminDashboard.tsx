
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { isAuthenticated, logoutAdmin } from '@/services/authService';
import { getAllApplications } from '@/services/loanService';
import { LoanApplication } from '@/types/loan';
import { Download, LogOut } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);

  useEffect(() => {
    // Check if admin is authenticated
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    
    // Load applications
    const loadApplications = () => {
      const allApps = getAllApplications();
      setApplications(allApps);
    };
    
    loadApplications();
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
  };

  const downloadApplicationAsPdf = () => {
    if (!selectedApplication) return;
    
    // Create PDF content
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
            {applications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Aucune demande de prêt pour le moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>{formatDate(app.createdAt)}</TableCell>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadApplicationAsPdf}
                >
                  <Download className="h-4 w-4 mr-2" /> Télécharger PDF
                </Button>
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
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                  Demande de Prêt #{selectedApplication.id.substring(0, 8)}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informations Personnelles</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 font-medium">Nom:</td>
                          <td>{selectedApplication.fullName}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Adresse:</td>
                          <td>{selectedApplication.address}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Téléphone:</td>
                          <td>{selectedApplication.phone}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Email:</td>
                          <td>{selectedApplication.email}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Emploi:</td>
                          <td>{selectedApplication.employment}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Détails du Prêt</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 font-medium">Montant:</td>
                          <td>{formatCurrency(selectedApplication.amount)}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Durée:</td>
                          <td>{selectedApplication.duration} mois</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Taux d'intérêt:</td>
                          <td>{selectedApplication.interestRate}%</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Date de demande:</td>
                          <td>{formatDate(selectedApplication.createdAt)}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Paiement:</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedApplication.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {selectedApplication.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Raison de la Demande</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.reason}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Documents Requis</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    <li>Carte d'identité nationale</li>
                    <li>2 photos d'identité récentes</li>
                    <li>Preuve d'adresse</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Signature</h3>
                  <p className="text-sm italic">{selectedApplication.signatureFullName}</p>
                </div>
                
                <div className="text-center text-xs text-gray-500 mt-8">
                  <p>AYITILOAN - Demande de prêt #{selectedApplication.id}</p>
                  <p>Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
