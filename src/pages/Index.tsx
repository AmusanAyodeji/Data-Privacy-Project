import { Mail, Trash2, FileSearch, Shield, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/ToolCard";
import FeatureIcon from "@/components/FeatureIcon";

const Index = () => {
  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-muted-foreground animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span>NDPR-aware privacy tools</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
              <span className="text-foreground">Privacy tools,</span>
              <br />
              <span className="text-gradient-primary">zero friction.</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Scan your email, delete your data, and understand privacy policies – 
              with NDPR in mind, no account needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="hero" size="xl" onClick={scrollToTools}>
                View tools
              </Button>
              <Button variant="glass" size="lg">
                Learn more
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose your tool
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No signup required. Click a tool and get started immediately.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ToolCard
              title="Email Scanner"
              description="See where your email appears and if it's been breached. Discover accounts you may have forgotten about."
              href="/email-scanner"
              icon={Mail}
              variant="cyan"
            />
            <ToolCard
              title="Delete My Data"
              description="Generate NDPR-based deletion emails to companies' Data Protection Officers. Take control of your information."
              href="/delete-data"
              icon={Trash2}
              variant="magenta"
            />
            <ToolCard
              title="Policy Lens"
              description="Paste a privacy policy or URL and get a clear, structured summary of what data they collect."
              href="/policy-lens"
              icon={FileSearch}
              variant="purple"
            />
          </div>
        </div>
      </section>

      {/* Reassurance Strip */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <FeatureIcon icon={Lock} label="No signup required" />
            <FeatureIcon icon={Shield} label="Privacy-aware design" />
            <FeatureIcon icon={Eye} label="NDPR-focused tools" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-foreground">Shadow Data</span>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-lg">
              Shadow Data minimizes storage and is meant as a privacy helper, not legal advice. 
              Always verify deletion requests and policy summaries independently.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Privacy First</span>
              <span>•</span>
              <span>NDPR Aware</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
