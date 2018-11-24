import { Stack, App } from '@aws-cdk/cdk';
import { CodeRepository } from './CodeRepository';
import { CodePipeline } from './CodePipeline';

export class DevToolsStack extends Stack {

    constructor(app: App, stackName: string) {
        super(app, stackName);
        this.create();
    }

    create = () => {
        // Create a code commit repo
        const repository = new CodeRepository(this, 'SampleStaticSiteRepo', 'sample-static-site').repository;

        // Create a code pipeline
        new CodePipeline({
            stack: this,
            logicalName: 'CodePipeline',
            pipelineName: 'code-pipeline',
            codeRepository: repository
        });
    }
}