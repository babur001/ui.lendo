import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./auth/i18n.ts";

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

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
