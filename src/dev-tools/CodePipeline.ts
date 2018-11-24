import { Pipeline, Stage } from '@aws-cdk/aws-codepipeline';
import { PipelineBuildAction, PipelineProject, CodeCommitSource, ComputeType, LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { PipelineSourceAction, Repository } from '@aws-cdk/aws-codecommit';
import { Stack } from '@aws-cdk/cdk';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export interface CodePipelineProps {
    stack: Stack,
    logicalName: string,
    pipelineName: string,
    codeRepository: Repository
}

export class CodePipeline {
    pipeline: Pipeline;
    constructor(private props: CodePipelineProps) {
        this.create();
    }

    create = () => {
        // Create the pipeline
        const pipeline = new Pipeline(this.props.stack, this.props.logicalName, {
            pipelineName: this.props.pipelineName,
            restartExecutionOnUpdate: true
        });
        this.pipeline = pipeline;

        const codeBuildRole = this.createCodeBuildRole();
        this.createSourceStage();
        this.createDevStage(codeBuildRole);
        this.createProdStage(codeBuildRole);
    }

    private createCodeBuildRole = (): Role => {
        const codeBuildProjectRole = new Role(this.props.stack, 'CodeBuildRole', {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        codeBuildProjectRole.attachManagedPolicy('arn:aws:iam::aws:policy/AdministratorAccess');
        return codeBuildProjectRole;
    }

    private createProdStage = (role: Role) => {
        // Prod stage and build & test action
        const prodStage = new Stage(this.props.stack, 'ProdStage', {
            pipeline: this.pipeline
        });

        const prodCodeBuildProject = this.createCodeBuildProject(role, 'DeployToProd');

        new PipelineBuildAction(this.props.stack, 'prodDeployAction', {
            project: prodCodeBuildProject,
            stage: prodStage
        })
    }

    private createDevStage = (role: Role) => {
        // Dev stage and build & test action
        const devStage = new Stage(this.props.stack, 'DevStage', {
            pipeline: this.pipeline
        });

        const buildAndTestCodeBuildProject = this.createCodeBuildProject(role, 'BuildAndTest');

        new PipelineBuildAction(this.props.stack, 'BuildAndTestAction', {
            project: buildAndTestCodeBuildProject,
            stage: devStage
        })
    }

    private createCodeBuildProject = (role: Role, logicalName: string): PipelineProject => {
        return new PipelineProject(this.props.stack, logicalName, {
            environment: {
                buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0
            },
            role
        })
    }

    private createSourceStage = () => {
        // Source stage and action
        const sourceStage = new Stage(this.props.stack, 'SourceStage', {
            pipeline: this.pipeline,
        });

        new PipelineSourceAction(this.props.stack, 'SourceAction', {
            repository: this.props.codeRepository,
            stage: sourceStage,
            pollForSourceChanges: true
        })
    }
}