import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { PolicyComplianceService } from '@/services/policyComplianceService';
import { supabase } from '@/lib/supabase';

interface PolicyCompliantContentModeratorProps {
  content: string;
  contentType: 'gig' | 'profile' | 'message';
  onValidationChange?: (isValid: boolean) => void;
}

export const PolicyCompliantContentModerator: React.FC<PolicyCompliantContentModeratorProps> = ({
  content,
  contentType,
  onValidationChange
}) => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    violations: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (content.trim().length > 0) {
      checkContent();
    }
  }, [content]);

  const checkContent = async () => {
    setIsChecking(true);
    try {
      const result = await PolicyComplianceService.validateContent(content, contentType);
      setValidationResult(result);
      onValidationChange?.(result.isValid);
      
      // Log moderation check
      if (!result.isValid) {
        await supabase.functions.invoke('ai-content-moderation', {
          body: {
            content,
            contentType,
            violations: result.violations,
            action: 'policy_violation_detected'
          }
        });
      }
    } catch (error) {
      console.error('Content validation failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!validationResult && !isChecking) return null;

  return (
    <div className="space-y-2">
      {isChecking && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 animate-spin" />
          Checking content compliance...
        </div>
      )}
      
      {validationResult && (
        <>
          {validationResult.isValid ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Content meets Google Play policies
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Content violates Google Play policies:
                <div className="flex flex-wrap gap-1 mt-2">
                  {validationResult.violations.map((violation, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {violation}
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default PolicyCompliantContentModerator;