import type { AppProps } from "next/app";

import "@/styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
  };

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
  
    return (

        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
   
    );
  }