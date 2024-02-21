import { ApplicationInsights, IConfig } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { createBrowserHistory, History } from 'history';

const browserHistory: History = createBrowserHistory({ });

const reactPlugin: ReactPlugin = new ReactPlugin();

const clickPluginInstance: ClickAnalyticsPlugin = new ClickAnalyticsPlugin();
const clickPluginConfig = {
  autoCapture: true,
};

const key = process.env.NEXT_PUBLIC_AZURE_APPLICATIONINSIGHTS_CONNECTION_STRING;

const configObj = {
  connectionString: key,
  enableAutoRouteTracking: true,
  extensions: [reactPlugin, clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: clickPluginConfig,
    [reactPlugin.identifier]: {
      history: browserHistory
    }
  },
};

const appInsights: ApplicationInsights = new ApplicationInsights({ config: configObj });
appInsights.loadAppInsights();
appInsights.trackPageView();
