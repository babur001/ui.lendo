import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GeistProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#12b855",
              borderRadius: 3,
            },
          }}
        >
          <CssBaseline />
          <App />
        </ConfigProvider>
      </GeistProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
