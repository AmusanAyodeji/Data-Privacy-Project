import { useState } from "react";
import { FileSearch, Link as LinkIcon, FileText, Shield, Users, Clock, UserCheck, AlertCircle, CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionCard from "@/components/SectionCard";
import Pill from "@/components/Pill";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type InputMode = "url" | "text";
type OverallCompliance = "Strong" | "Partial" | "Weak" | "Unknown";

// JSON format matching the backend response
interface PolicyAnalysisResponse {
  explanation: string;
  data_they_collect: {
    items: string[];
  };
  usage_and_sharing: {
    usage_purposes: string[];
    third_parties: string[];
  };
  deletion_and_your_rights: {
    data_retention: string;
    your_rights: string[];
  };
  ndpr_check: {
    overall_compliance: OverallCompliance;
    strengths: string[];
    gaps: string[];
    questions_to_ask: string[];
  };
}

// API base URL - update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper function to create empty/default response structure
const createEmptyResponse = (): PolicyAnalysisResponse => ({
  explanation: "Unknown",
  data_they_collect: { items: [] },
  usage_and_sharing: { usage_purposes: [], third_parties: [] },
  deletion_and_your_rights: { data_retention: "Not specified", your_rights: [] },
  ndpr_check: { overall_compliance: "Unknown", strengths: [], gaps: [], questions_to_ask: [] }
});

// Helper function to safely parse and validate API response
const parseApiResponse = (data: unknown): PolicyAnalysisResponse => {
  const response = createEmptyResponse();
  
  if (!data || typeof data !== 'object') {
    return response;
  }

  const apiData = data as Record<string, unknown>;

  // Parse explanation
  if (typeof apiData.explanation === 'string') {
    response.explanation = apiData.explanation;
  }

  // Parse data_they_collect
  if (apiData.data_they_collect && typeof apiData.data_they_collect === 'object') {
    const dataCollect = apiData.data_they_collect as Record<string, unknown>;
    if (Array.isArray(dataCollect.items)) {
      response.data_they_collect.items = dataCollect.items.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  }

  // Parse usage_and_sharing
  if (apiData.usage_and_sharing && typeof apiData.usage_and_sharing === 'object') {
    const usageSharing = apiData.usage_and_sharing as Record<string, unknown>;
    if (Array.isArray(usageSharing.usage_purposes)) {
      response.usage_and_sharing.usage_purposes = usageSharing.usage_purposes.filter(
        (item): item is string => typeof item === 'string'
      );
    }
    if (Array.isArray(usageSharing.third_parties)) {
      response.usage_and_sharing.third_parties = usageSharing.third_parties.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  }

  // Parse deletion_and_your_rights
  if (apiData.deletion_and_your_rights && typeof apiData.deletion_and_your_rights === 'object') {
    const deletionRights = apiData.deletion_and_your_rights as Record<string, unknown>;
    if (typeof deletionRights.data_retention === 'string') {
      response.deletion_and_your_rights.data_retention = deletionRights.data_retention;
    }
    if (Array.isArray(deletionRights.your_rights)) {
      response.deletion_and_your_rights.your_rights = deletionRights.your_rights.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  }

  // Parse ndpr_check
  if (apiData.ndpr_check && typeof apiData.ndpr_check === 'object') {
    const ndprCheck = apiData.ndpr_check as Record<string, unknown>;
    
    // Validate overall_compliance
    const validCompliance = ["Strong", "Partial", "Weak", "Unknown"];
    if (typeof ndprCheck.overall_compliance === 'string' && 
        validCompliance.includes(ndprCheck.overall_compliance)) {
      response.ndpr_check.overall_compliance = ndprCheck.overall_compliance as OverallCompliance;
    }
    
    if (Array.isArray(ndprCheck.strengths)) {
      response.ndpr_check.strengths = ndprCheck.strengths.filter(
        (item): item is string => typeof item === 'string'
      );
    }
    if (Array.isArray(ndprCheck.gaps)) {
      response.ndpr_check.gaps = ndprCheck.gaps.filter(
        (item): item is string => typeof item === 'string'
      );
    }
    if (Array.isArray(ndprCheck.questions_to_ask)) {
      response.ndpr_check.questions_to_ask = ndprCheck.questions_to_ask.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  }

  return response;
};

const PolicyLens = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PolicyAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    const input = inputMode === "url" ? urlInput.trim() : textInput.trim();
    if (!input) {
      toast({
        title: "No input provided",
        description: `Please enter a ${inputMode === "url" ? "URL" : "policy text"} to analyze.`,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null); // Clear previous analysis

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-policy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_type: inputMode,
          content: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsedAnalysis = parseApiResponse(data);
      setAnalysis(parsedAnalysis);
      
      toast({
        title: "Analysis complete",
        description: "Privacy policy has been analyzed.",
      });
    } catch (error) {
      console.error("Policy analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze the policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getComplianceColor = (compliance: OverallCompliance): "green" | "orange" | "magenta" | "cyan" => {
    switch (compliance) {
      case "Strong": return "green";
      case "Partial": return "orange";
      case "Weak": return "magenta";
      case "Unknown": return "cyan";
    }
  };

  const getComplianceIcon = (compliance: OverallCompliance) => {
    switch (compliance) {
      case "Strong": return CheckCircle;
      case "Partial": return AlertCircle;
      case "Weak": return XCircle;
      case "Unknown": return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent mb-6">
            <FileSearch className="w-4 h-4" />
            <span>Policy Lens</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Understand privacy policies
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste a privacy policy or URL to see what data they collect and how it's used.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <SectionCard variant="purple">
            <div className="space-y-6">
              {/* Mode Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setInputMode("url")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === "url"
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Paste URL
                </button>
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === "text"
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Paste text
                </button>
              </div>

              {/* Input Field */}
              {inputMode === "url" ? (
                <Input
                  placeholder="https://example.com/privacy-policy"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-12 bg-background/50"
                />
              ) : (
                <Textarea
                  placeholder="Paste the privacy policy text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] bg-background/50"
                />
              )}

              {/* Analyze Button */}
              <Button
                variant="purple"
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                    Analyzing policy...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-5 h-5" />
                    Analyze policy
                  </>
                )}
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* Results */}
        {analysis && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            {/* Explanation Card */}
            <SectionCard variant="purple" title="In simple terms" icon={FileText}>
              <p className="text-foreground leading-relaxed">
                {analysis.explanation || "Not specified"}
              </p>
            </SectionCard>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Data They Collect */}
              <SectionCard title="Data they collect" icon={Shield}>
                <div className="flex flex-wrap gap-2">
                  {analysis.data_they_collect.items.length > 0 ? (
                    analysis.data_they_collect.items.map((item, idx) => (
                      <Pill key={idx} variant="cyan">{item}</Pill>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Not specified</span>
                  )}
                </div>
              </SectionCard>

              {/* Usage & Sharing */}
              <SectionCard title="How they use & share it" icon={Users}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Usage purposes</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.usage_and_sharing.usage_purposes.length > 0 ? (
                        analysis.usage_and_sharing.usage_purposes.map((item, idx) => (
                          <Pill key={idx} variant="purple">{item}</Pill>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Third parties</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.usage_and_sharing.third_parties.length > 0 ? (
                        analysis.usage_and_sharing.third_parties.map((item, idx) => (
                          <Pill key={idx} variant="orange">{item}</Pill>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Deletion & Your Rights */}
              <SectionCard title="Deletion & your rights" icon={Clock}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Data retention</h4>
                    <p className="text-sm text-foreground">
                      {analysis.deletion_and_your_rights.data_retention || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Your rights</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.deletion_and_your_rights.your_rights.length > 0 ? (
                        analysis.deletion_and_your_rights.your_rights.map((right, idx) => (
                          <Pill key={idx} variant="green">{right}</Pill>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* NDPR Check */}
              <SectionCard title="NDPR check" icon={UserCheck}>
                <div className="space-y-4">
                  {/* Compliance Badge */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const ComplianceIcon = getComplianceIcon(analysis.ndpr_check.overall_compliance);
                      const complianceColor = getComplianceColor(analysis.ndpr_check.overall_compliance);
                      return (
                        <>
                          <ComplianceIcon className={`w-6 h-6 text-${complianceColor}`} />
                          <Pill variant={complianceColor}>
                            NDPR Compliance: {analysis.ndpr_check.overall_compliance}
                          </Pill>
                        </>
                      );
                    })()}
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-sm font-medium text-green mb-2">Strengths</h4>
                    {analysis.ndpr_check.strengths.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.ndpr_check.strengths.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-sm">None identified</span>
                    )}
                  </div>

                  {/* Gaps */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary mb-2">Gaps</h4>
                    {analysis.ndpr_check.gaps.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.ndpr_check.gaps.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <XCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-sm">None identified</span>
                    )}
                  </div>

                  {/* Questions to Ask */}
                  <div>
                    <h4 className="text-sm font-medium text-accent mb-2">Questions you can ask them</h4>
                    {analysis.ndpr_check.questions_to_ask.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.ndpr_check.questions_to_ask.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-accent">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-sm">None identified</span>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="magenta"
                size="lg"
                onClick={() => navigate("/delete-data")}
                className="gap-2"
              >
                <Mail className="w-5 h-5" />
                Generate DPO email from this policy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyLens;
