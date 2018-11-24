import { Stack } from '@aws-cdk/cdk';
import * as yaml from '../utils/Yaml';
import { CodeRepository } from '../../src/dev-tools/CodeRepository';

describe('CodePipeline', () => {
    it('should match the template snapshot', () => {
        // Given
        const stack = new Stack();

        // When
        new CodeRepository(stack, 'CodeRepo', 'code-repo');

        // Then
        expect(yaml.toYamlString(stack.toCloudFormation())).toMatchSnapshot();
    })
})