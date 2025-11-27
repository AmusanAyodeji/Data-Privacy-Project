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
type NdprRating = "strong" | "partial" | "weak";

interface PolicyAnalysis {
  summary: string;
  dataCollected: string[];
  usagePurposes: string[];
  thirdParties: string[];
  retention: string;
  userRights: string[];
  ndprRating: NdprRating;
  strengths: string[];
  gaps: string[];
  questions: string[];
  contactEmail?: string;
}

const mockAnalysis: PolicyAnalysis = {
  summary: "This policy covers data collection for service delivery and marketing. They collect substantial personal information and share it with multiple third parties for advertising purposes. Data retention periods are vague, and some user rights are mentioned but not all NDPR requirements are met.",
  dataCollected: ["Full name", "Email address", "Phone number", "IP address", "Device information", "Location data", "Browsing history", "Purchase history"],
  usagePurposes: ["Service delivery", "Account management", "Marketing communications", "Personalized advertising", "Analytics", "Fraud prevention"],
  thirdParties: ["Google Analytics", "Facebook Pixel", "Advertising partners", "Payment processors", "Cloud hosting providers"],
  retention: "Data is retained for as long as your account is active, plus an unspecified period for legal compliance. Marketing data may be kept indefinitely.",
  userRights: ["Access your data", "Correct inaccuracies", "Delete your account", "Opt-out of marketing"],
  ndprRating: "partial",
  strengths: [
    "Clear description of data collected",
    "Provides contact information for privacy queries",
    "Mentions some user rights"
  ],
  gaps: [
    "No specific mention of NDPR compliance",
    "Vague data retention periods",
    "Limited information on cross-border transfers",
    "Unclear consent mechanisms"
  ],
  questions: [
    "What is the exact data retention period for my account data?",
    "Which countries does my data get transferred to?",
    "How can I withdraw consent for marketing?",
    "Who is your Data Protection Officer?"
  ],
  contactEmail: "privacy@example.com"
};

const PolicyLens = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PolicyAnalysis | null>(null);

  const handleAnalyze = async () => {
    const hasInput = inputMode === "url" ? urlInput : textInput;
    if (!hasInput) {
      toast({
        title: "No input provided",
        description: `Please enter a ${inputMode === "url" ? "URL" : "policy text"} to analyze.`,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    toast({
      title: "Analysis complete",
      description: "Privacy policy has been analyzed.",
    });
  };

  const getRatingColor = (rating: NdprRating) => {
    switch (rating) {
      case "strong": return "green";
      case "partial": return "orange";
      case "weak": return "magenta";
    }
  };

  const getRatingIcon = (rating: NdprRating) => {
    switch (rating) {
      case "strong": return CheckCircle;
      case "partial": return AlertCircle;
      case "weak": return XCircle;
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
            {/* Summary Card */}
            <SectionCard variant="purple" title="In simple terms" icon={FileText}>
              <p className="text-foreground leading-relaxed">
                {analysis.summary}
              </p>
            </SectionCard>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Data Collected */}
              <SectionCard title="Data they collect" icon={Shield}>
                <div className="flex flex-wrap gap-2">
                  {analysis.dataCollected.map((item, idx) => (
                    <Pill key={idx} variant="cyan">{item}</Pill>
                  ))}
                </div>
              </SectionCard>

              {/* Usage & Sharing */}
              <SectionCard title="How they use & share it" icon={Users}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Usage purposes</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.usagePurposes.map((item, idx) => (
                        <Pill key={idx} variant="purple">{item}</Pill>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Third parties</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.thirdParties.map((item, idx) => (
                        <Pill key={idx} variant="orange">{item}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Retention & Rights */}
              <SectionCard title="Deletion & your rights" icon={Clock}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Data retention</h4>
                    <p className="text-sm text-foreground">{analysis.retention}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Your rights</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.userRights.map((right, idx) => (
                        <Pill key={idx} variant="green">{right}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* NDPR Check */}
              <SectionCard title="NDPR check" icon={UserCheck}>
                <div className="space-y-4">
                  {/* Rating Badge */}
                  <div className="flex items-center gap-3">
                    {(() => {
                      const RatingIcon = getRatingIcon(analysis.ndprRating);
                      return (
                        <>
                          <RatingIcon className={`w-6 h-6 text-${getRatingColor(analysis.ndprRating)}`} />
                          <Pill variant={getRatingColor(analysis.ndprRating)}>
                            NDPR Compliance: {analysis.ndprRating.charAt(0).toUpperCase() + analysis.ndprRating.slice(1)}
                          </Pill>
                        </>
                      );
                    })()}
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-sm font-medium text-green mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary mb-2">Gaps</h4>
                    <ul className="space-y-1">
                      {analysis.gaps.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Questions */}
                  <div>
                    <h4 className="text-sm font-medium text-accent mb-2">Questions you can ask them</h4>
                    <ul className="space-y-1">
                      {analysis.questions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-accent">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Action Button */}
            {analysis.contactEmail && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyLens;
