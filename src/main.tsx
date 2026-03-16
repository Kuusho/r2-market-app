import { createRoot } from "react-dom/client";
import { sdk } from "@farcaster/miniapp-sdk";
import App from "./App.tsx";
import "@farcaster/auth-kit/styles.css";
import "./index.css";

// Signal to Warpcast that the app is ready — must be called as early as possible
sdk.actions.ready().catch(() => {});

createRoot(document.getElementById("root")!).render(<App />);
