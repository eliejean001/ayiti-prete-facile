
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { submitLoanApplication } from '@/services/loanService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Home, User, Phone, Mail, FileText, DollarSign, Briefcase } from 'lucide-react';

const LoanApplicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Application form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    employment: '',
    employerName: '',
    employerPhone: '',
    employerAddress: '',
    reason: '',
    duration: 12,
    amount: 100000,
    interestRate: 5, // Default interest rate at 5%
    email: '',
    signatureFullName: '',
    termsAccepted: false,
    referenceName: '',
    referencePhone: '',
    referenceAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.termsAccepted) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les termes et conditions pour continuer.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to payment page with form data
    navigate('/paiement', { state: { formData } });
  };

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const interestRate = formData.interestRate / 100 / 12;
    const totalPayments = formData.duration;
    
    // Monthly payment formula: P = A * (r * (1+r)^n) / ((1+r)^n - 1)
    const monthlyPayment = 
      (formData.amount * interestRate * Math.pow(1 + interestRate, totalPayments)) / 
      (Math.pow(1 + interestRate, totalPayments) - 1);
    
    return Math.round(monthlyPayment);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-HT', { 
      style: 'currency', 
      currency: 'HTG',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">Demande de Prêt</h1>
      
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Formulaire de Demande</CardTitle>
          <CardDescription>
            Complétez le formulaire ci-dessous pour demander un prêt jusqu'à 500 000 HTG.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Informations Personnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Nom Complet
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Prénom et Nom"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Téléphone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+509 XXXX XXXX"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Adresse
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Votre adresse complète"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
            </div>
            
            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Informations d'Emploi</h3>
              <div className="space-y-2">
                <Label htmlFor="employment" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Situation Professionnelle
                </Label>
                <Input
                  id="employment"
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  placeholder="Poste actuel"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employerName">Nom de l'Employeur</Label>
                <Input
                  id="employerName"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  placeholder="Nom de l'entreprise"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employerPhone">Téléphone de l'Employeur</Label>
                  <Input
                    id="employerPhone"
                    name="employerPhone"
                    value={formData.employerPhone}
                    onChange={handleChange}
                    placeholder="+509 XXXX XXXX"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employerAddress">Adresse de l'Employeur</Label>
                  <Input
                    id="employerAddress"
                    name="employerAddress"
                    value={formData.employerAddress}
                    onChange={handleChange}
                    placeholder="Adresse de l'entreprise"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reference Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Référence Personnelle</h3>
              <div className="space-y-2">
                <Label htmlFor="referenceName">Nom de la Référence</Label>
                <Input
                  id="referenceName"
                  name="referenceName"
                  value={formData.referenceName}
                  onChange={handleChange}
                  placeholder="Nom complet"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referencePhone">Téléphone</Label>
                  <Input
                    id="referencePhone"
                    name="referencePhone"
                    value={formData.referencePhone}
                    onChange={handleChange}
                    placeholder="+509 XXXX XXXX"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referenceAddress">Adresse</Label>
                  <Input
                    id="referenceAddress"
                    name="referenceAddress"
                    value={formData.referenceAddress}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Loan Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Détails du Prêt</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Montant du Prêt</Label>
                    <span className="font-semibold">{formatCurrency(formData.amount)}</span>
                  </div>
                  <Slider
                    id="amount"
                    min={10000}
                    max={500000}
                    step={10000}
                    value={[formData.amount]}
                    onValueChange={(value) => handleSliderChange('amount', value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10 000 HTG</span>
                    <span>500 000 HTG</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="duration">Durée du Prêt (mois)</Label>
                    <span className="font-semibold">{formData.duration} mois</span>
                  </div>
                  <Slider
                    id="duration"
                    min={3}
                    max={36}
                    step={1}
                    value={[formData.duration]}
                    onValueChange={(value) => handleSliderChange('duration', value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3 mois</span>
                    <span>36 mois</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interestRate">Taux d'Intérêt (%)</Label>
                    <span className="font-semibold">{formData.interestRate}%</span>
                  </div>
                  <Slider
                    id="interestRate"
                    min={3}
                    max={10}
                    step={0.5}
                    value={[formData.interestRate]}
                    onValueChange={(value) => handleSliderChange('interestRate', value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Raison de la Demande
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Expliquez pourquoi vous avez besoin de ce prêt..."
                  rows={3}
                  required
                />
              </div>
            </div>
            
            {/* Loan Summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Résumé du Prêt</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Montant du Prêt:</div>
                <div className="font-semibold text-right">{formatCurrency(formData.amount)}</div>
                
                <div>Durée:</div>
                <div className="font-semibold text-right">{formData.duration} mois</div>
                
                <div>Taux d'Intérêt:</div>
                <div className="font-semibold text-right">{formData.interestRate}%</div>
                
                <div>Paiement Mensuel Estimé:</div>
                <div className="font-semibold text-right">{formatCurrency(calculateMonthlyPayment())}</div>
                
                <div>Total à Rembourser:</div>
                <div className="font-semibold text-right">{formatCurrency(calculateMonthlyPayment() * formData.duration)}</div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Termes et Conditions</h3>
              
              <div className="bg-gray-50 p-4 rounded-md text-sm h-40 overflow-y-auto">
                <h4 className="font-bold mb-2">CONTRAT DE PRÊT - AYITILOAN</h4>
                <p className="mb-2">
                  En soumettant cette demande, je confirme que toutes les informations fournies sont exactes et complètes.
                  Je comprends que des frais d'analyse de dossier non remboursables de 1 000 HTG seront appliqués.
                </p>
                <p className="mb-2">
                  Je comprends que le taux d'intérêt final sera déterminé après l'analyse de mon dossier et pourra varier entre 3% et 10% selon mon profil de crédit.
                </p>
                <p className="mb-2">
                  Je m'engage à fournir tous les documents requis pour l'analyse de ma demande, y compris ma carte d'identité nationale,
                  des photos d'identité récentes et une preuve d'adresse.
                </p>
                <p>
                  En cas d'approbation de mon prêt, je m'engage à effectuer les remboursements mensuels conformément au calendrier de paiement qui me sera communiqué.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="termsAccepted" className="text-sm">
                  J'accepte les termes et conditions du prêt
                </label>
              </div>
            </div>
            
            {/* Signature */}
            <div className="space-y-2">
              <Label htmlFor="signatureFullName">Signature (Prénom et Nom)</Label>
              <Input
                id="signatureFullName"
                name="signatureFullName"
                value={formData.signatureFullName}
                onChange={handleChange}
                placeholder="Tapez votre nom complet comme signature"
                required
              />
              <p className="text-sm text-gray-500">
                Envoyez votre carte d'identité nationale, 2 photos d'identité et une preuve d'adresse à cette adresse: <strong>documents@ayitiloan.ht</strong>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-gray-500 italic">
              Un frais d'analyse de dossier de 1 000 HTG sera appliqué. Ces frais sont non remboursables.
            </p>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <DollarSign className="mr-2 h-4 w-4" /> Soumettre la Demande
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoanApplicationForm;
