import { motion } from "framer-motion";
import { CloudRain, Waves, ArrowDownToLine, Zap, FileJson, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    id: "rainfall",
    title: "Rainfall Modeling",
    description: "Process raw precipitation data into audit-ready timeseries. Identify gaps, fill missing data, and visualize storm events instantly.",
    icon: CloudRain,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "runoff",
    title: "Runoff Simulation",
    description: "Convert rainfall to runoff with dynamic infiltration parameters. Test Horton vs. Green-Ampt methods on your catchment areas.",
    icon: Waves,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    id: "discharge",
    title: "Discharge Analysis",
    description: "Analyze node flooding and conduit capacity. Pinpoint surcharged pipes and visualize HGL profiles in real-time.",
    icon: ArrowDownToLine,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

const benefits = [
  {
    title: "Executable Inputs",
    description: "Don't just read about parameters. Upload your .inp file and see how changes affect the model immediately.",
    icon: FileJson,
  },
  {
    title: "Real-time Feedback",
    description: "Instant validation of your hydraulic assumptions. Catch errors before they become construction problems.",
    icon: Zap,
  },
  {
    title: "Visual Analytics",
    description: "Transform rows of text output into interactive charts and heatmaps that tell the story of the storm.",
    icon: BarChart3,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            The Singa<span className="text-brand-cyan">Pour</span> Suite
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Specialized tools for every stage of the hydraulic modeling lifecycle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-200 dark:border-slate-800 hover:border-brand-cyan/50 transition-colors duration-300 group overflow-hidden">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={24} />
                  </div>
                  <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Philosophy / Benefits Grid */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                Why Static Knowledge Isn't Enough
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                A blog post can define a surcharge, but it can't find the fifty nodes in your specific model that are about to flood. SingaPourApps bridges the gap between theoretical knowledge and practical application.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                      <benefit.icon className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-full min-h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              {/* Code/Data Visualization Mockup */}
              <div className="absolute inset-0 p-6 font-mono text-sm text-slate-300 overflow-hidden opacity-80">
                <div className="text-slate-500 mb-2">// SWMM5 Output Log Analysis</div>
                <div className="mb-1"><span className="text-brand-cyan">Reading</span> precipitation data...</div>
                <div className="mb-1"><span className="text-brand-green">Parsed</span> 8,760 hours of records.</div>
                <div className="mb-4 text-slate-500">----------------------------------------</div>
                <div className="text-brand-gold mb-1">[WARNING]</div>
                <div>Node J-12 surcharge depth &gt; 0.5m</div>
                <div className="text-slate-500 text-xs ml-4">at t=14:30:00 (Max Depth: 1.2m)</div>
                <div className="mt-2 text-brand-gold mb-1">[WARNING]</div>
                <div>Conduit C-45 capacity exceeded (110%)</div>
                <div className="text-slate-500 text-xs ml-4">Check upstream storage options.</div>
                
                {/* Visual overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase text-slate-400">System Status</span>
                    <span className="text-xs font-mono text-brand-green">Optimized</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-green h-full w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
