import { Repository } from '@aws-cdk/aws-codecommit';
import { Stack, Output } from '@aws-cdk/cdk';

export class CodeRepository {
    repository: Repository;

    constructor(private stack: Stack, private repoLogicalName: string, private repoName: string) {
        this.repository = this.create();
        this.createOutputs();
    }

    create(): Repository {
        return new Repository(this.stack, this.repoLogicalName, {
            repositoryName: this.repoName,
        })
    }

    createOutputs = () => {
        new Output(this.stack, 'RepositoryHttpUrl', {
            value: this.repository.repositoryCloneUrlHttp,
            disableExport: true
        })
    }
}