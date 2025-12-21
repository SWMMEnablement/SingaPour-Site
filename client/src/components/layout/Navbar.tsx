import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/generated_images/stylized_merlion_circuit_board_logo.png";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Rainfall", href: "#rainfall" },
    { name: "Runoff", href: "#runoff" },
    { name: "Discharge", href: "#discharge" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan p-[1px]">
              <div className="absolute inset-0 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center">
                 <img src={logo} alt="SingaPourApps Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white">
                SingaPour<span className="text-brand-cyan">Apps</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                Executable Engineering
              </span>
            </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-cyan transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-brand-blue hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/20">
            Start Modeling
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base font-medium text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full bg-brand-blue text-white mt-2">
              Start Modeling
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
