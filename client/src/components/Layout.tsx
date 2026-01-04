import { Link, useLocation } from "wouter";
import { LayoutDashboard, Eye, Search, Menu, X, Rocket } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/watchlist", label: "Watchlist", icon: Eye },
    { href: "/explorer", label: "Explorer", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">TezosDash</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-foreground/70 hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/25">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            TezosDash
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200", 
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-border">
          <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-xl border border-primary/10">
            <h4 className="font-display font-semibold text-primary mb-1">Live Mainnet</h4>
            <p className="text-xs text-muted-foreground">
              Connected to Tezos Node
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse" />
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen bg-background/50">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
