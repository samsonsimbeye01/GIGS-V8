import { supabase } from '@/lib/supabase';

// Google Play Policy Compliance Service
export class PolicyComplianceService {
  // Restricted Content Detection
  static async validateContent(content: string, type: 'gig' | 'profile' | 'message'): Promise<{ isValid: boolean; violations: string[] }> {
    const violations: string[] = [];
    const lowercaseContent = content.toLowerCase();
    
    // Child endangerment keywords
    const childEndangermentTerms = ['minor', 'child', 'underage', 'kid', 'baby', 'teen'];
    if (childEndangermentTerms.some(term => lowercaseContent.includes(term))) {
      violations.push('Child Endangerment');
    }
    
    // Inappropriate content
    const inappropriateTerms = ['adult', 'escort', 'massage', 'dating', 'sexual', 'intimate'];
    if (inappropriateTerms.some(term => lowercaseContent.includes(term))) {
      violations.push('Inappropriate Content');
    }
    
    // Gambling/games
    const gamblingTerms = ['bet', 'casino', 'lottery', 'gambling', 'poker', 'slots'];
    if (gamblingTerms.some(term => lowercaseContent.includes(term))) {
      violations.push('Real-Money Gambling');
    }
    
    // Illegal activities
    const illegalTerms = ['drugs', 'weapons', 'stolen', 'fake', 'counterfeit', 'illegal'];
    if (illegalTerms.some(term => lowercaseContent.includes(term))) {
      violations.push('Illegal Activities');
    }
    
    return { isValid: violations.length === 0, violations };
  }
  
  // User data privacy compliance
  static async logDataAccess(userId: string, dataType: string, purpose: string) {
    try {
      await supabase.from('data_access_logs').insert({
        user_id: userId,
        data_type: dataType,
        purpose,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log data access:', error);
    }
  }
  
  // Age verification for content
  static validateAgeAppropriate(content: string): boolean {
    const adultTerms = ['alcohol', 'tobacco', 'adult', 'mature', '18+', '21+'];
    return !adultTerms.some(term => content.toLowerCase().includes(term));
  }
  
  // Financial services compliance
  static validateFinancialContent(content: string): boolean {
    const financialTerms = ['loan', 'credit', 'investment', 'trading', 'forex', 'crypto'];
    return !financialTerms.some(term => content.toLowerCase().includes(term));
  }
}