import { Stack } from '@aws-cdk/cdk';
import * as yaml from '../utils/Yaml';
import { CodePipeline } from '../../src/dev-tools/CodePipeline';
import { Repository } from '@aws-cdk/aws-codecommit';

describe('CodePipeline', () => {
    it('should match the template snapshot', () => {
        // Given
        const stack = new Stack();
        const repository = new Repository(stack, 'Repository', {
            repositoryName: 'code-repo'
        })

        // When
        new CodePipeline({
            stack,
            logicalName: 'CodePipeline',
            pipelineName: 'code-pipeline',
            codeRepository: repository
        });

        // Then
        expect(yaml.toYamlString(stack.toCloudFormation())).toMatchSnapshot();
    })
})