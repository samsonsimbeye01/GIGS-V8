import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalContentProps {
  type: 'terms' | 'privacy' | 'conduct' | 'conflicts' | 'security' | 'contact';
}

export const LegalContent = ({ type }: LegalContentProps) => {
  if (type === 'terms') {
    return (
      <ScrollArea className="h-[70vh]">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1.1 Introduction</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Welcome to Linka.today ("Linka", "we", "us", "our"). These Terms and Conditions ("Terms") govern your access to and use of the Linka mobile and web platforms. By registering or using our services, you agree to comply with these Terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.2 Eligibility</h3>
            <p className="text-sm text-muted-foreground mb-2">To use Linka, you must:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Be at least 18 years old</li>
              <li>Have legal capacity to enter into binding agreements</li>
              <li>Provide accurate personal information and valid identification</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.3 User Responsibilities</h3>
            <p className="text-sm text-muted-foreground mb-2">Users agree to:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Use Linka lawfully and ethically</li>
              <li>Provide accurate job and personal data</li>
              <li>Refrain from harassment, discrimination, or fraudulent activity</li>
              <li>Respect all applicable labour, tax, and data protection laws</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.4 Gig Postings and Applications</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Posters must describe jobs accurately, including location, urgency, and payment</li>
              <li>Workers must only apply for gigs they can complete</li>
              <li>Cancellation policies: Jobs must be cancelled at least 2 hours in advance unless in emergencies</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.5 Payments</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>All payments are processed via Linka's secure system</li>
              <li>Disputes over payment must be raised within 48 hours of job completion</li>
              <li>Linka may withhold payment in cases of fraud or disputes</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.6 Trust Score System</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Users are scored on reliability, timeliness, ratings, and completion rate</li>
              <li>Repeated poor performance or misconduct may result in account suspension or termination</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.7 Intellectual Property</h3>
            <p className="text-sm text-muted-foreground">
              All Linka content, branding, software, and design are owned by Linka and may not be copied or repurposed without written permission.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.8 Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Linka is a platform that connects job posters with workers. We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Job quality or completion</li>
              <li>Any injuries or damages during gig execution</li>
              <li>Delayed or cancelled gigs</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.9 Termination</h3>
            <p className="text-sm text-muted-foreground">
              Linka may suspend or terminate accounts that breach these Terms, without prior notice.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1.10 Modifications</h3>
            <p className="text-sm text-muted-foreground">
              We reserve the right to update these Terms at any time. Users will be notified via email or app notice.
            </p>
          </section>
        </div>
      </ScrollArea>
    );
  }

  if (type === 'privacy') {
    return (
      <div className="space-y-4">
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
          <li>We collect only essential data (e.g., name, phone, location, payment info)</li>
          <li>We do not sell or share personal data with third parties without consent</li>
          <li>Users can request data deletion at any time by contacting support@linka.today</li>
        </ul>
      </div>
    );
  }

  if (type === 'conduct') {
    return (
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
        <li>Respect other users regardless of gender, race, religion, or background</li>
        <li>Do not use the platform to solicit illegal activity</li>
        <li>Repeated cancellations or no-shows may lead to suspension</li>
        <li>Abuse of the review system (fake reviews) is not tolerated</li>
      </ul>
    );
  }

  if (type === 'conflicts') {
    return (
      <ScrollArea className="h-[60vh]">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">2.1 Reporting a Conflict</h3>
            <p className="text-sm text-muted-foreground mb-2">Users may report a conflict via:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>In-app "Help & Support" → "Submit a Dispute"</li>
              <li>Emailing support@linka.today</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2.2 Conflict Types</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Payment disputes</li>
              <li>Non-completion of work</li>
              <li>Disrespect or harassment</li>
              <li>False job descriptions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2.3 Investigation Process</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>A case number is assigned within 24 hours</li>
              <li>Both parties are contacted for evidence</li>
              <li>Platform logs and message history are reviewed</li>
              <li>A ruling is made within 3 business days</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2.4 Resolution Outcomes</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Partial refund</li>
              <li>Full payment release</li>
              <li>Warning or suspension</li>
              <li>Mediation via phone (for complex cases)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2.5 Escalation</h3>
            <p className="text-sm text-muted-foreground">
              If either party disagrees with a decision, it may be escalated to a third-party arbitrator or local authority, as appropriate.
            </p>
          </section>
        </div>
      </ScrollArea>
    );
  }

  if (type === 'security') {
    return (
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
        <li>Two-factor authentication (2FA) for login</li>
        <li>All data encrypted in transit and at rest</li>
        <li>Verified profiles via KYC (Know Your Customer)</li>
        <li>Admin panel access restricted to authorised personnel</li>
      </ul>
    );
  }

  if (type === 'contact') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          For support, disputes, or legal matters:
        </p>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Email:</span>
            <a href="mailto:support@linka.today" className="text-primary ml-2">support@linka.today</a>
          </div>
          <div>
            <span className="font-semibold">Phone/WhatsApp:</span>
            <span className="ml-2">+255-XXX-XXX-XXX</span>
          </div>
          <div>
            <span className="font-semibold">Address:</span>
            <span className="ml-2">Linka Technologies Ltd., Dar es Salaam, Tanzania</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};