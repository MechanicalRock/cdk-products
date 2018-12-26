import { Stack, Output, FnSub } from '@aws-cdk/cdk';
import { PublicHostedZone } from '@aws-cdk/aws-route53';

export interface HostedZoneProps {
    stack: Stack,
    fullyQualifiedDomainName: string
}

export class HostedZone {
    hostedZone: PublicHostedZone;

    constructor(private props: HostedZoneProps) {
        this.create();
        this.publishOutputs();
    }

    create(): any {
        const hostedZone = new PublicHostedZone(this.props.stack, 'HostedZone', {
            zoneName: this.props.fullyQualifiedDomainName,
            comment: `Hosted zone for domain: ${this.props.fullyQualifiedDomainName}`
        });
        this.hostedZone = hostedZone;
    }
    
    publishOutputs(): any {
        new Output(this.props.stack, 'HostedZoneId', {
            value: this.hostedZone.hostedZoneId
        });
        // new Output(this.props.stack, 'NameServers', {
        //     value: this.hostedZone.nameServers
        // })
    }
}