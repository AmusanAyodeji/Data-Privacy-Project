import { useState } from "react";
import { Mail, AlertTriangle, Check, HelpCircle, Sparkles, Database, FileKey, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionCard from "@/components/SectionCard";
import Pill from "@/components/Pill";

interface ScanOption {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface ServiceResult {
  id: string;
  name: string;
  icon?: string;
  status: "confirmed" | "likely";
  confidence?: number;
  sources: string[];
}

interface Breach {
  name: string;
  date: string;
  fields: string[];
}

const EmailScanner = () => {
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  
  const [scanOptions, setScanOptions] = useState<ScanOption[]>([
    { id: "breach", label: "Breach check", icon: AlertTriangle, enabled: true },
    { id: "ai", label: "AI suggestions", icon: Sparkles, enabled: true },
  ]);

  // Mock data for demonstration
  const [confirmedServices] = useState<ServiceResult[]>([
    { id: "1", name: "Google", status: "confirmed", sources: ["Breach", "User-confirmed"] },
    { id: "2", name: "Facebook", status: "confirmed", sources: ["Breach"] },
    { id: "3", name: "Twitter/X", status: "confirmed", sources: ["Breach", "AI"] },
  ]);

  const [likelyServices] = useState<ServiceResult[]>([
    { id: "4", name: "LinkedIn", status: "likely", confidence: 85, sources: ["AI"] },
    { id: "5", name: "Spotify", status: "likely", confidence: 72, sources: ["AI"] },
    { id: "6", name: "Netflix", status: "likely", confidence: 65, sources: ["AI"] },
  ]);

  const [breaches] = useState<Breach[]>([
    { name: "Collection #1", date: "January 2019", fields: ["Email", "Password"] },
    { name: "Facebook 2021", date: "April 2021", fields: ["Email", "Phone", "Name"] },
  ]);

  const toggleOption = (id: string) => {
    setScanOptions(options =>
      options.map(opt =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  const handleScan = async () => {
    if (!email) return;
    setIsScanning(true);
    // Simulate scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsScanning(false);
    setHasResults(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/30 text-sm text-cyan mb-6">
            <Mail className="w-4 h-4" />
            <span>Email Scanner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover your digital footprint
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter an email to see suspected services and known breaches. No account required.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <SectionCard variant="cyan">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary text-lg"
                />
              </div>

              {/* Scan Options */}
              <div className="flex flex-wrap gap-3">
                {scanOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      option.enabled
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Scan Button */}
              <Button
                variant="cyan"
                size="lg"
                className="w-full"
                onClick={handleScan}
                disabled={!email || isScanning}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Scan email
                  </>
                )}
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* Results */}
        {hasResults && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Breach Alert */}
            {breaches.length > 0 && (
              <SectionCard variant="magenta" className="border-secondary/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <AlertTriangle className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      We found {breaches.length} breaches for this email
                    </h3>
                    <div className="space-y-3">
                      {breaches.map((breach, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-background/50"
                        >
                          <span className="font-medium text-foreground">{breach.name}</span>
                          <span className="text-sm text-muted-foreground">{breach.date}</span>
                          <div className="flex gap-2 ml-auto">
                            {breach.fields.map((field) => (
                              <Pill key={field} variant="magenta">{field}</Pill>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Confirmed Services */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green" />
                  <h2 className="text-xl font-bold text-foreground">Confirmed services</h2>
                  <span className="text-sm text-muted-foreground">({confirmedServices.length})</span>
                </div>
                <div className="space-y-3">
                  {confirmedServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>

              {/* Likely Services */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange" />
                  <h2 className="text-xl font-bold text-foreground">Likely services</h2>
                  <span className="text-sm text-muted-foreground">({likelyServices.length})</span>
                </div>
                <div className="space-y-3">
                  {likelyServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceCard = ({ service }: { service: ServiceResult }) => {
  const sourceIcons: Record<string, React.ElementType> = {
    "Breach": AlertTriangle,
    "User-confirmed": Check,
    "AI": Sparkles,
    "CSV": FileKey,
  };

  return (
    <div className="glass-card p-4 group hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        {/* Service Icon */}
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-xl font-bold text-muted-foreground">
          {service.name.charAt(0)}
        </div>

        {/* Service Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{service.name}</h4>
            <Pill variant={service.status === "confirmed" ? "green" : "orange"}>
              {service.status === "confirmed" ? "Confirmed" : `${service.confidence}% likely`}
            </Pill>
          </div>
          <div className="flex items-center gap-2">
            {service.sources.map((source) => {
              const Icon = sourceIcons[source] || Database;
              return (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Icon className="w-3 h-3" />
                  {source}
                </span>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {service.status === "likely" && (
            <>
              <Button variant="ghost" size="sm" className="text-green hover:text-green">
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                ✕
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            Add to delete list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailScanner;
