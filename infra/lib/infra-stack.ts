import {
    CfnOutput,
    Fn,
    Stack,
    StackProps,
    aws_cloudfront as cloudfront,
    aws_iam as iam,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_s3 as s3,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BlogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const githubIdpDomain = "token.actions.githubusercontent.com";
    const githubIdp = new iam.OpenIdConnectProvider(this, 'githubProvider', {
        url: `https://${githubIdpDomain}`,
        clientIds: ['sts.amazonaws.com'],
    });

    const blogDeploymentPolicy = new iam.ManagedPolicy(this, "BlogDeploymentPolicy", {
		statements: [
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					"sts:AssumeRole"
				],
				resources: [
					"arn:aws:iam::*:role/cdk-*"
				]
			}),
		]
	});
    const blogDeploymentRole = new iam.Role(this, "BlogDeploymentRole", {
        assumedBy: new iam.WebIdentityPrincipal(githubIdpDomain, {
            StringLike: { 
                [`${githubIdpDomain}:sub`]: `repo:akdev1l/blog:main`,
            },
        }),
		managedPolicies: [
			blogDeploymentPolicy,
		],
    });

    const domainName = this.node.tryGetContext("BLOG_DOMAIN");
    const blogDeploymentUser = new iam.User(this, `BlogDeploymentUser`);
    const blogHostedZone = new route53.HostedZone(this, `BlogHostedZone`, {
        zoneName: domainName,
    });
    const blogBucket = new s3.Bucket(this, `BlogSourceBucket-${domainName}`);
    const blogWebDistribution = new cloudfront.CloudFrontWebDistribution(this, `BlogWebDistribution`, {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: blogBucket,
                },
                behaviors: [{ isDefaultBehavior: true }],
            },
        ],
    });

    const blogDnsRecord = new route53.ARecord(this, `BlogDNSRecord`, {
        zone: blogHostedZone,
        target: route53.RecordTarget.fromAlias(
            new targets.CloudFrontTarget(blogWebDistribution),
        ),
    });

    const outputs: { key: string; value: string; }[] = [
        {
            key: "blogZoneId",
            value: blogHostedZone.hostedZoneId,
        },
        {
            key: "blogZoneNameServers",
            value: Fn.join(",",blogHostedZone.hostedZoneNameServers ?? []),
        },
    ];

    outputs.map(output => new CfnOutput(this, output.key, { value: output.value }));
  }
}
