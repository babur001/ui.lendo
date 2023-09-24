import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
