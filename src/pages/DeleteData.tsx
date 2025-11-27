import { useState, useEffect } from "react";
import { Trash2, Copy, ExternalLink, Check, Building2, Plus, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionCard from "@/components/SectionCard";
import Pill from "@/components/Pill";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Service {
  id: string;
  name: string;
  dpoEmail: string;
  selected: boolean;
}

interface GeneratedEmail {
  service: string;
  dpoEmail: string;
  subject: string;
  body: string;
}

const popularServices: Service[] = [
  { id: "google", name: "Google", dpoEmail: "data-protection-office@google.com", selected: false },
  { id: "meta", name: "Meta/Facebook", dpoEmail: "dataprotection@fb.com", selected: false },
  { id: "twitter", name: "Twitter/X", dpoEmail: "dpo@twitter.com", selected: false },
  { id: "amazon", name: "Amazon", dpoEmail: "eu-privacy@amazon.com", selected: false },
  { id: "apple", name: "Apple", dpoEmail: "dpo@apple.com", selected: false },
  { id: "netflix", name: "Netflix", dpoEmail: "privacy@netflix.com", selected: false },
  { id: "kuda", name: "Kuda", dpoEmail: "dpo@kuda.com", selected: false },
  { id: "github", name: "GitHub", dpoEmail: "dpo@github.com", selected: false },
  { id: "spotify", name: "Spotify", dpoEmail: "privacy@spotify.com", selected: false },
  { id: "bet9ja", name: "Bet9ja", dpoEmail: "dataprotection@bet9ja.com", selected: false },
  { id: "sportybet", name: "SportyBet", dpoEmail: "compliance@sportybet.com", selected: false },
  { id: "medium", name: "Medium", dpoEmail: "privacy@medium.com", selected: false },
  { id: "reddit", name: "Reddit", dpoEmail: "dpo@reddit.com", selected: false },
  { id: "linkedin", name: "LinkedIn", dpoEmail: "https://www.linkedin.com/help/linkedin/ask/TSO-DPO", selected: false },
  { id: "tiktok", name: "TikTok", dpoEmail: "https://www.tiktok.com/legal/report/dpo", selected: false },
  { id: "opay", name: "OPay", dpoEmail: "ng-privacy@opay-inc.com", selected: false },
  { id: "jumia", name: "Jumia", dpoEmail: "Nigeria.Legal@Jumia.com", selected: false },
  { id: "konga", name: "Konga", dpoEmail: "dataprotection@kongapay.com", selected: false },
  { id: "piggyvest", name: "PiggyVest", dpoEmail: "legal@piggyvest.com", selected: false },
  { id: "palmpay", name: "PalmPay", dpoEmail: "dpo@palmpay-inc.com", selected: false },
  { id: "pinterest", name: "Pinterest", dpoEmail: "privacy-support@pinterest.com", selected: false },
];

const generateEmailTemplate = (fullName: string, email: string, serviceName: string): string => {
  return `Dear Data Protection Officer,

I am writing to exercise my rights under the Nigeria Data Protection Regulation (NDPR) regarding my personal data held by ${serviceName}.

I hereby request the following:

1. ACCESS: Please provide me with a copy of all personal data you hold about me.

2. ERASURE: I request the complete deletion of all my personal data from your systems, databases, and any third-party processors.

3. CONFIRMATION: Please confirm within 30 days that:
   - All my data has been deleted
   - Any third parties with whom you shared my data have also deleted it
   - No backups containing my data remain

My details for identification:
- Full Name: ${fullName}
- Email Address: ${email}

If you require any additional information to verify my identity or process this request, please contact me immediately.

Please note that under the NDPR, you are required to respond to this request within 30 days.

Thank you for your prompt attention to this matter.

Yours sincerely,
${fullName}`;
};

const DeleteData = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customId, setCustomId] = useState("");
  const [services, setServices] = useState<Service[]>(popularServices);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Handle preselected services from Email Scanner
  useEffect(() => {
    const state = location.state as { preselectedServices?: string[] } | null;
    if (state?.preselectedServices && state.preselectedServices.length > 0) {
      setServices(currentServices =>
        currentServices.map(service => {
          // Check if service name matches any preselected service (case-insensitive)
          const isPreselected = state.preselectedServices!.some(
            preselected => 
              service.id.toLowerCase() === preselected.toLowerCase() ||
              service.name.toLowerCase() === preselected.toLowerCase() ||
              service.name.toLowerCase().includes(preselected.toLowerCase()) ||
              preselected.toLowerCase().includes(service.name.toLowerCase())
          );
          return isPreselected ? { ...service, selected: true } : service;
        })
      );
      
      toast({
        title: "Services preselected",
        description: `${state.preselectedServices.length} service(s) from your scan have been selected.`,
      });
    }
  }, [location.state, toast]);

  const selectedCount = services.filter(s => s.selected).length;

  const toggleService = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const handleGenerate = () => {
    if (!fullName || !email) {
      toast({
        title: "Missing information",
        description: "Please enter your full name and email address.",
        variant: "destructive",
      });
      return;
    }

    const selectedServices = services.filter(s => s.selected);
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service.",
        variant: "destructive",
      });
      return;
    }

    const emails = selectedServices.map(service => ({
      service: service.name,
      dpoEmail: service.dpoEmail,
      subject: `NDPR Data Subject Access and Erasure Request - ${fullName}`,
      body: generateEmailTemplate(fullName, email, service.name),
    }));

    setGeneratedEmails(emails);
    toast({
      title: "Emails generated",
      description: `Generated ${emails.length} deletion request emails.`,
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard.",
    });
  };

  const openInEmail = (email: GeneratedEmail) => {
    // Check if dpoEmail is a URL (for platforms like LinkedIn, TikTok)
    if (email.dpoEmail.startsWith("http://") || email.dpoEmail.startsWith("https://")) {
      window.open(email.dpoEmail, '_blank');
      toast({
        title: "Opening DPO portal",
        description: `${email.service} uses a web form for data requests. The email body has been copied to your clipboard.`,
      });
      navigator.clipboard.writeText(email.body);
    } else {
      const mailtoLink = `mailto:${email.dpoEmail}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(mailtoLink, '_blank');
    }
  };

  // Open in Gmail compose
  const openInGmail = (email: GeneratedEmail) => {
    if (email.dpoEmail.startsWith("http://") || email.dpoEmail.startsWith("https://")) {
      window.open(email.dpoEmail, '_blank');
      navigator.clipboard.writeText(email.body);
      toast({
        title: "Opening DPO portal",
        description: `${email.service} uses a web form. Email body copied to clipboard.`,
      });
    } else {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.dpoEmail)}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(gmailUrl, '_blank');
    }
  };

  // Open in Outlook compose
  const openInOutlook = (email: GeneratedEmail) => {
    if (email.dpoEmail.startsWith("http://") || email.dpoEmail.startsWith("https://")) {
      window.open(email.dpoEmail, '_blank');
      navigator.clipboard.writeText(email.body);
      toast({
        title: "Opening DPO portal",
        description: `${email.service} uses a web form. Email body copied to clipboard.`,
      });
    } else {
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email.dpoEmail)}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(outlookUrl, '_blank');
    }
  };

  // Open in Yahoo Mail compose
  const openInYahoo = (email: GeneratedEmail) => {
    if (email.dpoEmail.startsWith("http://") || email.dpoEmail.startsWith("https://")) {
      window.open(email.dpoEmail, '_blank');
      navigator.clipboard.writeText(email.body);
      toast({
        title: "Opening DPO portal",
        description: `${email.service} uses a web form. Email body copied to clipboard.`,
      });
    } else {
      const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(email.dpoEmail)}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(yahooUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-sm text-secondary mb-6">
            <Trash2 className="w-4 h-4" />
            <span>Delete My Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Take back your data
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate NDPR-based deletion emails to Data Protection Officers. No signup required.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Personal Details */}
              <SectionCard variant="magenta" title="Your details" icon={Building2}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Full name <span className="text-secondary">*</span>
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email address <span className="text-secondary">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Phone (optional)
                      </label>
                      <Input
                        placeholder="+234..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Account ID (optional)
                      </label>
                      <Input
                        placeholder="Customer ID"
                        value={customId}
                        onChange={(e) => setCustomId(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Service Selection */}
              <SectionCard 
                title="Select services" 
                subtitle={`${selectedCount} selected`}
                icon={Plus}
              >
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        service.selected
                          ? "bg-secondary/20 text-secondary border-2 border-secondary/50"
                          : "bg-muted/50 text-muted-foreground border-2 border-transparent hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              </SectionCard>

              {/* Generate Button */}
              <Button
                variant="magenta"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
              >
                <Trash2 className="w-5 h-5" />
                Generate emails ({selectedCount})
              </Button>
            </div>

            {/* Right Column - Generated Emails */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Generated emails</h2>
              
              {generatedEmails.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Select services and click "Generate emails" to create NDPR-based deletion requests.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {generatedEmails.map((email, index) => (
                    <div key={index} className="glass-card p-4 space-y-3 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{email.service}</span>
                          <Pill variant="magenta">{email.dpoEmail}</Pill>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="text-sm">
                        <span className="text-muted-foreground">Subject: </span>
                        <span className="text-foreground">{email.subject}</span>
                      </div>

                      {/* Body Preview */}
                      <div className="bg-background/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                          {email.body}
                        </pre>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(email.body, index)}
                          className="flex-1"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy email
                            </>
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="magenta"
                              size="sm"
                              className="flex-1"
                            >
                              <Mail className="w-4 h-4" />
                              Send email
                              <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openInGmail(email)}>
                              <span className="mr-2">📧</span> Open in Gmail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInOutlook(email)}>
                              <span className="mr-2">📬</span> Open in Outlook
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInYahoo(email)}>
                              <span className="mr-2">✉️</span> Open in Yahoo Mail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInEmail(email)}>
                              <span className="mr-2">💻</span> Default email app
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteData;
