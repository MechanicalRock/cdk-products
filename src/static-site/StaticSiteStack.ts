import * as cdk from '@aws-cdk/cdk';
import { Parameter } from '@aws-cdk/cdk';
import { StaticSiteBucket } from './StaticSiteBucket';
import { OriginAccessIdentity } from './OriginAccessIdentity';
import { Cloudfront } from './Cloudfront';
import { HostedZone } from './HostedZone';

export class StaticSiteStack extends cdk.Stack {
    bucketParameter: Parameter;

    constructor(parent: cdk.App, stackName: string, props?: cdk.StackProps) {
        super(parent, stackName, props);
        this.create();
    }

    create = () => {
        const originAccessIdentityResource = new OriginAccessIdentity(this).getResource();

        const siteBucket = new StaticSiteBucket({
            stack: this,
            logicalName: 'StaticSiteBucket',
            originAccessIdentityCanonicalId: originAccessIdentityResource.cloudFrontOriginAccessIdentityS3CanonicalUserId
        });

        new Cloudfront({
            stack: this,
            siteBucket: siteBucket.bucket,
            logicalName: 'static-site-cloudfront',
            originAccessIdentity: originAccessIdentityResource
        })

        new HostedZone({
            stack: this,
            fullyQualifiedDomainName: 'myexamplesite.com.au'
        });
    }
}