import { Provider } from "./components/ui/provider"
import { StrictMode, Suspense } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import QueryProvider from "./components/shared/QueryProvider"
import { LoadingFallback } from "./components/shared/Loading"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <Provider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </Provider>
    </QueryProvider>
  </StrictMode>,
)