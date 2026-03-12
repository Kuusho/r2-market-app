import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import GridAccess from "./pages/GridAccess";
import ProtocolDirectives from "./pages/ProtocolDirectives";
import AgentProfile from "./pages/AgentProfile";
import Databank from "./pages/Databank";
import NotFound from "./pages/NotFound";

function RefRedirect() {
  const { code } = useParams<{ code: string }>();
  if (code) localStorage.setItem("r2_referral_code", code);
  return <Navigate to="/directives" replace />;
}

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GridAccess />} />
            <Route path="/ref/:code" element={<RefRedirect />} />
            <Route path="/directives" element={<ProtocolDirectives />} />
            <Route path="/profile" element={<AgentProfile />} />
            <Route path="/databank" element={<Databank />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
