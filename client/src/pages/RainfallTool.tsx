import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, CloudRain, Play, AlertTriangle, Droplets, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SwmmModel, RainfallData } from "@shared/schema";

export default function RainfallTool() {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [results, setResults] = useState<RainfallData | null>(null);

  const { data: models = [] } = useQuery<SwmmModel[]>({
    queryKey: ["/api/models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      return res.json();
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const res = await fetch(`/api/analyze/rainfall/${modelId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to analyze");
      return res.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/tools" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-blue transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Tools</span>
          </Link>
          <div className="flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-blue-500" />
            <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Rainfall Auditor
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Model Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Model to Analyze</CardTitle>
              <CardDescription>
                Choose a SWMM model to audit its rainfall data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                  <SelectTrigger className="flex-1" data-testid="select-model">
                    <SelectValue placeholder="Select a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => selectedModelId && analyzeMutation.mutate(selectedModelId)}
                  disabled={!selectedModelId || analyzeMutation.isPending}
                  className="bg-brand-blue hover:bg-blue-700"
                  data-testid="button-analyze"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {analyzeMutation.isPending ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
              
              {models.length === 0 && (
                <p className="text-sm text-slate-500 mt-4">
                  No models uploaded yet. <Link href="/tools" className="text-brand-blue hover:underline">Upload a model first</Link>.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Droplets className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.totalDepth.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Total Depth ({results.unit})</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                        <TrendingUp className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.peakIntensity.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Peak Intensity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Clock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.duration}
                        </p>
                        <p className="text-xs text-slate-500">Data Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.gaps.length}
                        </p>
                        <p className="text-xs text-slate-500">Data Gaps</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Storm Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Storm Events Detected</CardTitle>
                  <CardDescription>
                    Identified {results.stormEvents.length} distinct storm events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.stormEvents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Event</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Start</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">End</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Depth ({results.unit})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.stormEvents.map((event, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-2 font-mono text-slate-900 dark:text-white">Storm {i + 1}</td>
                              <td className="py-2 font-mono text-slate-600 dark:text-slate-400">{event.start}</td>
                              <td className="py-2 font-mono text-slate-600 dark:text-slate-400">{event.end}</td>
                              <td className="py-2 text-right font-mono text-brand-blue">{event.depth.toFixed(3)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500">No storm events detected in the timeseries data.</p>
                  )}
                </CardContent>
              </Card>

              {/* Rainfall Visualization */}
              {results.values.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rainfall Hyetograph</CardTitle>
                    <CardDescription>Visual representation of precipitation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end gap-[1px] bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      {results.values.slice(0, 100).map((val, i) => {
                        const maxVal = Math.max(...results.values);
                        const height = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-brand-blue rounded-t-sm min-w-[2px] transition-all hover:bg-brand-cyan"
                            style={{ height: `${height}%` }}
                            title={`${results.timeseries[i]}: ${val.toFixed(3)} ${results.unit}`}
                          />
                        );
                      })}
                    </div>
                    {results.values.length > 100 && (
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Showing first 100 of {results.values.length} data points
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Data Gaps */}
              {results.gaps.length > 0 && (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                      Data Gaps Identified
                    </CardTitle>
                    <CardDescription>
                      The following periods have missing or zero rainfall data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.gaps.map((gap, i) => (
                        <div key={i} className="flex items-center gap-4 p-2 rounded bg-amber-50 dark:bg-amber-900/20">
                          <span className="text-sm font-mono text-amber-700 dark:text-amber-400">
                            {gap.start} → {gap.end}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
