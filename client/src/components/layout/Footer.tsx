import { Link } from "wouter";
import { Twitter } from "lucide-react";
import logo from "@assets/generated_images/stylized_merlion_circuit_board_logo.png";

export default function Footer() {
  const shareText = encodeURIComponent("Stop watching tutorials on Hydrology and Hydraulics. Start running models. 🌊 Introducing SingaPourApps: The home of Executable Engineering. #Hydrology #SWMM");
  const shareUrl = "https://twitter.com/intent/tweet?text=" + shareText;

  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                <img src={logo} alt="Logo" className="w-8 h-8 opacity-90" />
                <span className="font-heading font-bold text-xl text-white">SingaPour<span className="text-brand-cyan">Apps</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Engineering expertise made executable. Tools for the next generation of hydraulic modelers.
            </p>
            <div className="flex gap-4">
              <a 
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center justify-center group"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-50 cursor-not-allowed">
                {/* Placeholder for LinkedIn */}
                <span className="text-xs font-bold">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Apps</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Rainfall Auditor</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Runoff Simulator</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Discharge Analyzer</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Infiltration Calc</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-cyan transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Philosophy</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SingaPourApps. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Inspired by Water. Powered by Code.</p>
        </div>
      </div>
    </footer>
  );
}
