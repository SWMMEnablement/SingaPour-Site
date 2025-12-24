import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowDownToLine, Play, AlertTriangle, Circle, Minus, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SwmmModel, DischargeResults } from "@shared/schema";

export default function DischargeTool() {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [results, setResults] = useState<DischargeResults | null>(null);

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
      const res = await fetch(`/api/analyze/discharge/${modelId}`, {
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
            <ArrowDownToLine className="w-6 h-6 text-indigo-500" />
            <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Discharge Analyzer
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
                Choose a SWMM model to analyze nodes and conduits
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
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Circle className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.totalNodes}
                        </p>
                        <p className="text-xs text-slate-500">Total Nodes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Minus className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.totalConduits}
                        </p>
                        <p className="text-xs text-slate-500">Total Conduits</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={results.surchargingNodes.length > 0 ? "border-amber-300" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.surchargingNodes.length}
                        </p>
                        <p className="text-xs text-slate-500">Surcharging</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={results.potentialFloodNodes.length > 0 ? "border-red-300" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Droplet className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {results.potentialFloodNodes.length}
                        </p>
                        <p className="text-xs text-slate-500">Flood Risk</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Warnings */}
              {(results.surchargingNodes.length > 0 || results.potentialFloodNodes.length > 0) && (
                <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                      System Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.surchargingNodes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Nodes with Surcharge Potential:</h4>
                        <div className="flex flex-wrap gap-2">
                          {results.surchargingNodes.map((node) => (
                            <span key={node} className="px-2 py-1 rounded bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-sm font-mono">
                              {node}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.potentialFloodNodes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Nodes with Limited Depth (Flood Risk):</h4>
                        <div className="flex flex-wrap gap-2">
                          {results.potentialFloodNodes.map((node) => (
                            <span key={node} className="px-2 py-1 rounded bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm font-mono">
                              {node}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Nodes Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Node Inventory</CardTitle>
                  <CardDescription>
                    Junctions, outfalls, and storage units in the model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.nodes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Name</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Type</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Invert</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Max Depth</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Surcharge</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.nodes.slice(0, 20).map((node, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-2 font-mono text-slate-900 dark:text-white">{node.name}</td>
                              <td className="py-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  node.type === 'JUNCTION' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' :
                                  node.type === 'OUTFALL' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                }`}>
                                  {node.type}
                                </span>
                              </td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{node.invertElev.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{node.maxDepth.toFixed(2)}</td>
                              <td className="py-2 text-right font-mono">
                                <span className={node.surchargeDepth > 0 ? 'text-amber-600' : 'text-slate-400'}>
                                  {node.surchargeDepth.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {results.nodes.length > 20 && (
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          Showing 20 of {results.nodes.length} nodes
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500">No nodes found in the model.</p>
                  )}
                </CardContent>
              </Card>

              {/* Conduits Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Conduit Network</CardTitle>
                  <CardDescription>
                    Pipes and channels connecting the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.conduits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Name</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">From</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">To</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Length</th>
                            <th className="text-left py-2 font-medium text-slate-600 dark:text-slate-400">Shape</th>
                            <th className="text-right py-2 font-medium text-slate-600 dark:text-slate-400">Size</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.conduits.slice(0, 20).map((conduit, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-2 font-mono text-slate-900 dark:text-white">{conduit.name}</td>
                              <td className="py-2 font-mono text-slate-600 dark:text-slate-400">{conduit.fromNode}</td>
                              <td className="py-2 font-mono text-slate-600 dark:text-slate-400">{conduit.toNode}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">{conduit.length.toFixed(1)}</td>
                              <td className="py-2 text-xs font-medium text-brand-blue">{conduit.shape}</td>
                              <td className="py-2 text-right font-mono text-slate-600 dark:text-slate-400">
                                {conduit.geom1.toFixed(2)}
                                {conduit.geom2 > 0 && ` x ${conduit.geom2.toFixed(2)}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {results.conduits.length > 20 && (
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          Showing 20 of {results.conduits.length} conduits
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500">No conduits found in the model.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
