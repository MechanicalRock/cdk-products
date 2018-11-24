import { Stack } from '@aws-cdk/cdk';
import { cloudformation as cf } from '@aws-cdk/aws-cloudfront';

export class OriginAccessIdentity {
    private originAccessIdentity: cf.CloudFrontOriginAccessIdentityResource;
    constructor(private stack: Stack) {
        this.originAccessIdentity = this.create();
    }

    getResource = () => {
        return this.originAccessIdentity;
    }

    private create = (): cf.CloudFrontOriginAccessIdentityResource => {
        return new cf.CloudFrontOriginAccessIdentityResource(this.stack, 'OriginAccessIdentity', {
            cloudFrontOriginAccessIdentityConfig: {
                comment: 'Cloud front user which will be allowed to access the site s3 bucket'
            }
        });
    }

}
