import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { AuthKitProvider } from "@farcaster/auth-kit";
import GridAccess from "./pages/GridAccess";
import ProtocolDirectives from "./pages/ProtocolDirectives";
import AgentProfile from "./pages/AgentProfile";
import Databank from "./pages/Databank";
import DiscordSuccess from "./pages/DiscordSuccess";
import NotFound from "./pages/NotFound";

function RefRedirect() {
  const { code } = useParams<{ code: string }>();
  if (code) localStorage.setItem("r2_referral_code", code);
  return <Navigate to="/directives" replace />;
}

const queryClient = new QueryClient();

const farcasterConfig = {
  relay: 'https://relay.farcaster.xyz',
  rpcUrl: 'https://mainnet.optimism.io',
  domain: typeof window !== 'undefined' ? window.location.host : '',
  siweUri: typeof window !== 'undefined' ? window.location.origin : '',
}

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <AuthKitProvider config={farcasterConfig}>
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
            <Route path="/discord-success" element={<DiscordSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
