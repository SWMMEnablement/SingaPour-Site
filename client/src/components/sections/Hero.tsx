import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CloudRain, Activity, Download } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_digital_water_flow_hero_background.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30">
        <img 
          src={heroBg} 
          alt="Digital Water Flow" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                <span className="text-xs font-mono font-medium text-brand-blue dark:text-brand-cyan uppercase tracking-wider">
                  Next Gen SWMM Modeling
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                Stop Watching Tutorials on Hydrology and Hydraulics. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">
                  Start Running Models.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
                The home of Executable Engineering. Move beyond static blogs and videos. Upload your .inp files and let the insights pour.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-brand-blue hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base shadow-xl shadow-blue-500/20 group">
                  Start Modeling
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Read Philosophy
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Abstract App Interface Mockup */}
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] group">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-auto text-[10px] font-mono text-slate-400">runoff_simulation.inp</div>
                </div>
                
                {/* Content */}
                <div className="p-6 pt-16 h-full flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="h-24 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 flex flex-col justify-between group-hover:border-brand-cyan/30 transition-colors duration-500">
                         <div className="w-8 h-8 rounded-md bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                           {i === 1 ? <CloudRain size={16} /> : i === 2 ? <Activity size={16} /> : <Download size={16} />}
                         </div>
                         <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                       </div>
                     ))}
                  </div>
                  
                  {/* Graph */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path d="M0,50 Q25,40 50,20 T100,30 V50 H0 Z" fill="rgba(0, 229, 255, 0.1)" stroke="none" />
                      <path d="M0,50 Q25,40 50,20 T100,30" fill="none" stroke="#00E5FF" strokeWidth="0.5" className="animate-[dash_5s_linear_infinite]" strokeDasharray="5" />
                    </svg>
                    
                    {/* Animated Data Points */}
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-brand-blue rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-brand-green rounded-full animate-ping delay-75"></div>
                  </div>
                </div>

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-cyan/5 pointer-events-none"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                  S
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Processing</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Active Model</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
