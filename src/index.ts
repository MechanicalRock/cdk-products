import { App } from '@aws-cdk/cdk';
import { StaticSiteStack } from './static-site/StaticSiteStack';
import { DevToolsStack } from './dev-tools/DevToolsStack';

const app = new App();
new StaticSiteStack(app, 'StaticSiteStack');
new DevToolsStack(app, 'DevToolsStack');

app.run();