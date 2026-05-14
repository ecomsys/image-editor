import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";

import autoREM from "../utils/auto-rem";

export function AppProviders() {
  useEffect(() => {
    const cleanup = autoREM(1536, 16);
    return () => cleanup();
  }, []);

  return (
    <BrowserRouter basename="/spa/image-editor/">
      <AppRouter />
    </BrowserRouter>
  );
}
