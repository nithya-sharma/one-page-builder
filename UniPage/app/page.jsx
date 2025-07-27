"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Sparkles,
  Download,
  Eye,
  Code,
  Palette,
  Globe,
  Star,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import JSZip from "jszip";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSite, setGeneratedSite] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate website");

      setGeneratedSite(data.html);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedSite) return;
    try {
      const zip = new JSZip();
      zip.file("index.html", generatedSite);
      zip.file("README.md", `# Generated Website\nGenerated with UniPage`);
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-generated-website.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to create download package");
    }
  };

  const openInNewTab = () => {
    if (!generatedSite) return;
    const win = window.open();
    if (win) {
      win.document.write(generatedSite);
      win.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f5ff] via-[#e8e3ff] to-[#c4b5fd]">
      {/* Header */}
      <header className="border-b border-purple-200 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                UniPage
              </h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Powered by Gemini AI
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Create Beautiful Websites <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Using Just One Prompt
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Build, customize, and launch websites faster than ever.
            </p>
          </div>

          {/* Notice */}
          <div className="max-w-4xl mx-auto mb-10">
            <Card className="bg-yellow-50 border-yellow-200 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Setup Required</h4>
                    <p className="text-yellow-800 text-sm mb-2">
                      Add your Gemini API key to the .env.local file to enable generation.
                    </p>
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-yellow-900 hover:underline"
                    >
                      Get your free API key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Input */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your website
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Modern SaaS homepage with testimonials, pricing, and dark mode"
                    className="min-h-[120px] resize-none"
                    disabled={isGenerating}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Website generated successfully!</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Website
                      </>
                    )}
                  </Button>

                  {generatedSite && (
                    <>
                      <Button
                        onClick={openInNewTab}
                        variant="outline"
                        className="py-6 text-lg font-semibold"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Open
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="py-6 text-lg font-semibold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download ZIP
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Preview */}
      {generatedSite && (
        <section className="py-16 bg-gradient-to-tr from-white via-gray-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Preview Your Site</h3>
              <p className="text-gray-600">Live view of your AI-generated design</p>
            </div>
            <Card className="shadow-xl overflow-hidden border-0">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-600 ml-4">
                      Generated Preview
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={openInNewTab}>
                    <Eye className="w-4 h-4 mr-1" /> Full View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 overflow-hidden">
                  <iframe
                    srcDoc={generatedSite}
                    className="w-full h-full border-0"
                    title="Website Preview"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
            <h4 className="text-2xl font-bold">UniPage</h4>
          </div>
          <p className="text-gray-300 mb-4">
            Made with ❤️ using Gemini AI
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
