import React, { useEffect, useState } from "react"
import { AppInsightsContext, defaultContextValue, IAppInsightsContext } from "./app-insights-context" // Ensure defaultAppInsights is imported
import { createAppInsights } from "./app-insights"

type AppInsightsProviderProps = {
  children: React.ReactNode
}

export const AppInsightsProvider: React.FunctionComponent<AppInsightsProviderProps> = ({ children }) => {
  const [appInsights, setAppInsights] = useState<IAppInsightsContext>(defaultContextValue) // Use default value directly

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const ai = await createAppInsights() // Assuming createAppInsights might be async
      if (ai) {
        setAppInsights(ai) // Successfully initialized
      } // No else needed since we have a default
    }

    initialize().catch(error => console.error("Failed to initialize AppInsights:", error))
  }, [])

  return <AppInsightsContext.Provider value={appInsights}>{children}</AppInsightsContext.Provider>
}

export default AppInsightsProvider
