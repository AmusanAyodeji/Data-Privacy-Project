import { useState } from "react";
import { Mail, AlertTriangle, Check, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionCard from "@/components/SectionCard";
import Pill from "@/components/Pill";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// API response format - matches actual backend response
interface BreachResult {
  email: string;
  hash_password: boolean;
  password: string;
  sha1: string;
  hash: string;
  sources: string;
}

interface ScanResponse {
  message: string;
  result: BreachResult[];
}

// Parsed service from sources
interface ConfirmedService {
  id: string;
  name: string;
  hasPassword: boolean;
  addedToDeleteList: boolean;
}

// API base URL - Render backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://data-privacy-project.onrender.com";

const EmailScanner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [confirmedServices, setConfirmedServices] = useState<ConfirmedService[]>([]);
  const [hasResults, setHasResults] = useState(false);

  // Parse sources string into individual services
  const parseSourcesIntoServices = (results: BreachResult[]): ConfirmedService[] => {
    const servicesMap = new Map<string, ConfirmedService>();
    
    results.forEach((result) => {
      // Sources can be comma-separated or a single value
      const sources = result.sources?.split(",").map(s => s.trim()).filter(s => s.length > 0) || [];
      
      sources.forEach((source) => {
        // Clean up the source name (remove .com, etc. for cleaner display)
        const cleanName = source.replace(/\.(com|org|net|io|co)$/i, "");
        const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
        
        if (!servicesMap.has(id)) {
          servicesMap.set(id, {
            id,
            name: cleanName,
            hasPassword: result.hash_password || false,
            addedToDeleteList: false,
          });
        } else {
          // If already exists and this result has password leaked, update it
          const existing = servicesMap.get(id)!;
          if (result.hash_password) {
            existing.hasPassword = true;
          }
        }
      });
    });
    
    return Array.from(servicesMap.values());
  };

  const handleScan = async () => {
    if (!email) {
      toast({
        title: "No email provided",
        description: "Please enter an email address to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanMessage(null);
    setConfirmedServices([]);
    setHasResults(false);

    try {
      const response = await fetch(`${API_BASE_URL}/check_email/?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.status} ${response.statusText}`);
      }

      const data: ScanResponse = await response.json();
      
      setScanMessage(data.message);
      
      if (data.result && data.result.length > 0) {
        const services = parseSourcesIntoServices(data.result);
        setConfirmedServices(services);
      }
      
      setHasResults(true);
      toast({
        title: "Scan complete",
        description: data.message,
      });
    } catch (error) {
      console.error("Email scan error:", error);
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "Failed to scan email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const toggleAddToDeleteList = (serviceId: string) => {
    setConfirmedServices(services =>
      services.map(s =>
        s.id === serviceId ? { ...s, addedToDeleteList: !s.addedToDeleteList } : s
      )
    );
  };

  const goToDeleteDataWithServices = () => {
    const selectedServices = confirmedServices
      .filter(s => s.addedToDeleteList)
      .map(s => s.name.toLowerCase());
    
    // Navigate to delete data page with selected services as state
    navigate("/delete-data", { state: { preselectedServices: selectedServices } });
  };

  const selectedForDeletionCount = confirmedServices.filter(s => s.addedToDeleteList).length;

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
            Enter an email to see known breaches. No account required.
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
            {/* Breach Alert / No Breach Message */}
            {confirmedServices.length > 0 ? (
              <SectionCard variant="magenta" className="border-secondary/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <AlertTriangle className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {scanMessage}
                    </h3>
                    <p className="text-muted-foreground">
                      Select the services below to add them to your data deletion request.
                    </p>
                  </div>
                </div>
              </SectionCard>
            ) : (
              <SectionCard variant="cyan" className="border-green/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green/20">
                    <Shield className="w-6 h-6 text-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {scanMessage || "No breaches found"}
                    </h3>
                    <p className="text-muted-foreground">
                      Good news! This email wasn't found in any known data breaches.
                    </p>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Confirmed Services */}
            {confirmedServices.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green" />
                    <h2 className="text-xl font-bold text-foreground">Breached services</h2>
                    <span className="text-sm text-muted-foreground">({confirmedServices.length})</span>
                  </div>
                  {selectedForDeletionCount > 0 && (
                    <Button
                      variant="magenta"
                      size="sm"
                      onClick={goToDeleteDataWithServices}
                    >
                      <Plus className="w-4 h-4" />
                      Request deletion ({selectedForDeletionCount})
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {confirmedServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onToggleDelete={() => toggleAddToDeleteList(service.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: ConfirmedService;
  onToggleDelete: () => void;
}

const ServiceCard = ({ service, onToggleDelete }: ServiceCardProps) => {
  return (
    <div className={`glass-card p-4 transition-all ${service.addedToDeleteList ? 'border-secondary/50 bg-secondary/5' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Service Icon */}
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-xl font-bold text-muted-foreground">
          {service.name.charAt(0).toUpperCase()}
        </div>

        {/* Service Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{service.name}</h4>
            <Pill variant="green">Confirmed</Pill>
          </div>
          <div className="flex items-center gap-2">
            {service.hasPassword && (
              <Pill variant="magenta">
                <AlertTriangle className="w-3 h-3" />
                Password leaked
              </Pill>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={service.addedToDeleteList ? "magenta" : "outline"}
            size="sm"
            onClick={onToggleDelete}
          >
            {service.addedToDeleteList ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to delete list
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailScanner;
