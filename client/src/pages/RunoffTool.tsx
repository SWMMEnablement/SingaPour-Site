import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Waves, Play, MapPin, Percent, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SwmmModel, RunoffResults } from "@shared/schema";

export default function RunoffTool() {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [results, setResults] = useState<RunoffResults | null>(null);

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
      const res = await fetch(`/api/analyze/runoff/${modelId}`, {
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
            <Waves className="w-6 h-6 text-cyan-500" />
            <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Runoff Simulator
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Model Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Model to Analyze</CardTitle>
              <CardDescription>
                Choose a SWMM model to analyze subcatchment and runoff parameters
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
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                        <MapPin className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.subcatchments.length}
                        </p>
                        <p className="text-xs text-slate-500">Subcatchments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Ruler className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.totalArea.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Total Area (ac/ha)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Percent className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.avgImperv.toFixed(1)}%
                        </p>
                        <p className="text-xs text-slate-500">Avg Imperviousness</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Infiltration Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Infiltration Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center">
                      <Waves className="w-6 h-6 text-brand-green" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {results.infiltrationMethod}
                      </p>
                      <p className="text-sm text-slate-500">
                        {results.infiltrationMethod === 'HORTON' && 'Horton equation with exponential decay'}
                        {results.infiltrationMethod === 'GREEN_AMPT' && 'Green-Ampt infiltration model'}
                        {results.infiltrationMethod === 'CURVE_NUMBER' && 'SCS Curve Number method'}
                        {!['HORTON', 'GREEN_AMPT', 'CURVE_NUMBER'].includes(results.infiltrationMethod) && 'Custom infiltration method'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subcatchment Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Subcatchment Parameters</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each subcatchment's characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.subcatchments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Name</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Area</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">%Imperv</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Width</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Slope%</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">n-Imperv</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">n-Perv</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.subcatchments.map((sub, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-2 font-mono text-slate-900 dark:text-white">{sub.name}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{sub.area.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono text-cyan-600">{sub.imperv.toFixed(1)}%</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{sub.width.toFixed(1)}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{sub.slope.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{sub.nImperv.toFixed(3)}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{sub.nPerv.toFixed(3)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500">No subcatchments found in the model.</p>
                  )}
                </CardContent>
              </Card>

              {/* Imperviousness Distribution */}
              {results.subcatchments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Imperviousness Distribution</CardTitle>
                    <CardDescription>Visual breakdown by subcatchment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.subcatchments.slice(0, 10).map((sub, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="w-24 text-sm font-mono text-slate-600 dark:text-slate-400 truncate">
                            {sub.name}
                          </span>
                          <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full transition-all"
                              style={{ width: `${sub.imperv}%` }}
                            />
                          </div>
                          <span className="w-12 text-sm font-mono text-right text-slate-900 dark:text-white">
                            {sub.imperv.toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                    {results.subcatchments.length > 10 && (
                      <p className="text-xs text-slate-500 mt-4 text-center">
                        Showing top 10 of {results.subcatchments.length} subcatchments
                      </p>
                    )}
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
