import { motion } from "framer-motion";
import { Droplet, TrendingUp, ShieldCheck } from "lucide-react";
import logo from "@assets/generated_images/stylized_merlion_circuit_board_logo.png";

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/3 flex justify-center">
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-3xl animate-pulse-glow"></div>
              <img 
                src={logo} 
                alt="SingaPourApps Brand Mark" 
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
          
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                Fluid Intelligence for Your Models
              </h2>
              
              <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300 mb-8">
                <p>
                  SingaPourApps was built on a simple premise: <strong>Engineering expertise should be executable.</strong>
                </p>
                <p>
                  Inspired by world-class standards in water management, we provide tools that transform static data into a dynamic flow of insights. Don’t just manage the rain; model the storm actively.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border-l-4 border-brand-gold pl-6 py-2">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-brand-gold">Singa</span>
                    <span className="text-sm font-normal text-slate-500 uppercase tracking-wider">The Standard</span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Represents the gold standard of high-tech, efficient water management we aspire to.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-blue pl-6 py-2">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-brand-blue">Pour</span>
                    <span className="text-sm font-normal text-slate-500 uppercase tracking-wider">The Action</span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-2">
                    Taking raw rainfall data and converting it into actionable results. Let the insights pour.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
