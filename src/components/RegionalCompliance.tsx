import React, { useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, AlertTriangle, Scale, Phone } from 'lucide-react';

interface RegionalComplianceProps {
  className?: string;
}

const RegionalCompliance: React.FC<RegionalComplianceProps> = ({ className = '' }) => {
  const { country, getEmergencyNumbers } = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const emergencyNumbers = getEmergencyNumbers();

  const getRegionalInfo = () => {
    const info: Record<string, {
      taxInfo: string;
      laborLaws: string[];
      paymentMethods: string[];
      legalRequirements: string[];
    }> = {
      'NG': {
        taxInfo: 'Freelancers earning above ₦300,000 annually must register for tax.',
        laborLaws: [
          'Minimum wage: ₦30,000/month',
          'Maximum 8 hours work per day',
          'Overtime pay required after 8 hours'
        ],
        paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash'],
        legalRequirements: [
          'Valid National ID (NIN) required',
          'BVN verification for payments above ₦50,000',
          'Tax identification number for business accounts'
        ]
      },
      'KE': {
        taxInfo: 'Pay-as-you-earn (PAYE) applies to earnings above KSh 24,000/month.',
        laborLaws: [
          'Minimum wage: KSh 13,572/month',
          'Maximum 45 hours work per week',
          'Rest day mandatory every 7 days'
        ],
        paymentMethods: ['M-Pesa', 'Bank Transfer', 'Airtel Money'],
        legalRequirements: [
          'Valid Kenyan ID or passport',
          'KRA PIN for tax purposes',
          'Work permit required for non-citizens'
        ]
      },
      'TZ': {
        taxInfo: 'Skills development levy of 6% applies to certain services.',
        laborLaws: [
          'Minimum wage: TSh 400,000/month',
          'Maximum 45 hours work per week',
          'Annual leave: 28 days minimum'
        ],
        paymentMethods: ['Mobile Money', 'Bank Transfer', 'Cash'],
        legalRequirements: [
          'Valid Tanzanian ID',
          'TIN number for tax compliance',
          'Business license for regular services'
        ]
      }
    };
    
    return info[country.code] || info['KE'];
  };

  const regionalInfo = getRegionalInfo();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-4 h-4" />
          Regional Compliance - {country.name}
          <Badge variant="outline">{country.currency}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="tax">Tax Info</TabsTrigger>
            <TabsTrigger value="labor">Labor Laws</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms" className="space-y-4">
            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                By using Linka in {country.name}, you agree to comply with local laws and regulations.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium">Legal Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {regionalInfo.legalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Accepted Payment Methods:</h4>
              <div className="flex flex-wrap gap-2">
                {regionalInfo.paymentMethods.map((method, index) => (
                  <Badge key={index} variant="secondary">{method}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="terms" className="text-sm">
                I accept the terms and conditions for {country.name}
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="tax" className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {regionalInfo.taxInfo}
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-muted-foreground">
              <p>Please consult with a local tax advisor for specific requirements.</p>
              <p className="mt-2">Linka does not provide tax advice or services.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="labor" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Key Labor Regulations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {regionalInfo.laborLaws.map((law, index) => (
                  <li key={index}>{law}</li>
                ))}
              </ul>
            </div>
            
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                These are general guidelines. Always verify current local labor laws.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="emergency" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <h4 className="font-medium">Police</h4>
                  <p className="text-lg font-bold">{emergencyNumbers.police}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-medium">Ambulance</h4>
                  <p className="text-lg font-bold">{emergencyNumbers.ambulance}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <h4 className="font-medium">Fire</h4>
                  <p className="text-lg font-bold">{emergencyNumbers.fire}</p>
                </CardContent>
              </Card>
            </div>
            
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Save these numbers in your phone for emergencies while working.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegionalCompliance;