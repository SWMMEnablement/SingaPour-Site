import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CloudRain, Waves, ArrowDownToLine, Upload, Trash2, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { SwmmModel } from "@shared/schema";

const tools = [
  {
    id: "rainfall",
    title: "Rainfall Auditor",
    description: "Analyze precipitation timeseries data, identify gaps, and visualize storm events.",
    icon: CloudRain,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/tools/rainfall",
  },
  {
    id: "runoff",
    title: "Runoff Simulator",
    description: "Analyze subcatchment parameters, infiltration methods, and runoff characteristics.",
    icon: Waves,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    href: "/tools/runoff",
  },
  {
    id: "discharge",
    title: "Discharge Analyzer",
    description: "Examine nodes, conduits, surcharge potential, and system capacity.",
    icon: ArrowDownToLine,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    href: "/tools/discharge",
  },
];

export default function Tools() {
  const [modelName, setModelName] = useState("");
  const [modelContent, setModelContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models = [], isLoading } = useQuery<SwmmModel[]>({
    queryKey: ["/api/models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { name: string; content: string }) => {
      const res = await fetch("/api/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to upload model");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      setModelName("");
      setModelContent("");
      toast({ title: "Model uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to upload model", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/models/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete model");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      toast({ title: "Model deleted" });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setModelContent(event.target?.result as string);
        if (!modelName) {
          setModelName(file.name.replace(".inp", ""));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName || !modelContent) {
      toast({ title: "Please provide a name and upload a file", variant: "destructive" });
      return;
    }
    uploadMutation.mutate({ name: modelName, content: modelContent });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-cyan transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
            Modeling <span className="text-brand-cyan">Tools</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-brand-blue" />
                  Upload SWMM Model
                </CardTitle>
                <CardDescription>
                  Upload your .inp file to analyze with our tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Model name"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      data-testid="input-model-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                      Upload .inp file
                    </label>
                    <Input
                      type="file"
                      accept=".inp,.txt"
                      onChange={handleFileUpload}
                      data-testid="input-file-upload"
                    />
                  </div>
                  {modelContent && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                        Or paste content directly
                      </label>
                      <Textarea
                        placeholder="Paste SWMM .inp content here..."
                        value={modelContent}
                        onChange={(e) => setModelContent(e.target.value)}
                        rows={6}
                        className="font-mono text-xs"
                        data-testid="textarea-model-content"
                      />
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-blue-700"
                    disabled={uploadMutation.isPending}
                    data-testid="button-upload-model"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Model"}
                  </Button>
                </form>

                {/* Uploaded Models */}
                {models.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-sm mb-3 text-slate-900 dark:text-white">Your Models</h4>
                    <div className="space-y-2">
                      {models.map((model) => (
                        <div
                          key={model.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                          data-testid={`model-item-${model.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium">{model.name}</span>
                          </div>
                          <button
                            onClick={() => deleteMutation.mutate(model.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            data-testid={`button-delete-${model.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tools Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">
              Analysis Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={tool.href}>
                    <Card className="h-full cursor-pointer hover:border-brand-cyan/50 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${tool.bg} ${tool.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                          <tool.icon size={24} />
                        </div>
                        <CardTitle className="font-heading">{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {tool.description}
                        </CardDescription>
                        <div className="mt-4 text-sm text-brand-blue dark:text-brand-cyan font-medium">
                          Open Tool →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {models.length === 0 && (
              <div className="mt-8 p-8 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
                  No models uploaded yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload a SWMM .inp file to start analyzing with our tools.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
