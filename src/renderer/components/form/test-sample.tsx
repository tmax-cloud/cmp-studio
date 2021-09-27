export const sampleSchema = {
  properties: {
    access_key: {
      type: 'string',
      description:
        "The access key for API operations. You can retrieve this\nfrom the 'Security & Credentials' section of the AWS console.",
      optional: true,
    },
    allowed_account_ids: {
      type: 'object',
      optional: true,
    },
    forbidden_account_ids: {
      type: 'object',
      optional: true,
    },
    insecure: {
      type: 'boolean',
      description:
        'Explicitly allow the provider to perform "insecure" SSL requests. If omitted,default value is `false`',
      optional: true,
    },
    max_retries: {
      type: 'number',
      description:
        'The maximum number of times an AWS API request is\nbeing executed. If the API request still fails, an error is\nthrown.',
      optional: true,
    },
    profile: {
      type: 'string',
      description:
        'The profile for API operations. If not set, the default profile\ncreated with `aws configure` will be used.',
      optional: true,
    },
    region: {
      type: 'string',
      description:
        'The region where AWS operations will take place. Examples\nare us-east-1, us-west-2, etc.',
      required: true,
    },
    s3_force_path_style: {
      type: 'boolean',
      description:
        'Set this to true to force the request to use path-style addressing,\ni.e., http://s3.amazonaws.com/BUCKET/KEY. By default, the S3 client will\nuse virtual hosted bucket addressing when possible\n(http://BUCKET.s3.amazonaws.com/KEY). Specific to the Amazon S3 service.',
      optional: true,
    },
    secret_key: {
      type: 'string',
      description:
        "The secret key for API operations. You can retrieve this\nfrom the 'Security & Credentials' section of the AWS console.",
      optional: true,
    },
    shared_credentials_file: {
      type: 'string',
      description:
        'The path to the shared credentials file. If not set\nthis defaults to ~/.aws/credentials.',
      optional: true,
    },
    skip_credentials_validation: {
      type: 'boolean',
      description:
        'Skip the credentials validation via STS API. Used for AWS API implementations that do not have STS available/implemented.',
      optional: true,
    },
    skip_get_ec2_platforms: {
      type: 'boolean',
      description:
        "Skip getting the supported EC2 platforms. Used by users that don't have ec2:DescribeAccountAttributes permissions.",
      optional: true,
    },
    skip_metadata_api_check: {
      type: 'boolean',
      optional: true,
    },
    skip_region_validation: {
      type: 'boolean',
      description:
        'Skip static validation of region name. Used by users of alternative AWS-like APIs or users w/ access to regions that are not public (yet).',
      optional: true,
    },
    skip_requesting_account_id: {
      type: 'boolean',
      description:
        'Skip requesting the account ID. Used for AWS API implementations that do not have IAM/STS API and/or metadata API.',
      optional: true,
    },
    token: {
      type: 'string',
      description:
        'session token. A session token is only required if you are\nusing temporary security credentials.',
      optional: true,
    },
    assume_role: {
      nesting_mode: 'list',
      max_items: 1,
      properties: {
        duration_seconds: {
          type: 'number',
          description: 'Seconds to restrict the assume role session duration.',
          optional: true,
        },
        external_id: {
          type: 'string',
          description:
            'Unique identifier that might be required for assuming a role in another account.',
          optional: true,
        },
        policy: {
          type: 'string',
          description:
            'IAM Policy JSON describing further restricting permissions for the IAM Role being assumed.',
          optional: true,
        },
        policy_arns: {
          type: 'object',
          description:
            'Amazon Resource Names (ARNs) of IAM Policies describing further restricting permissions for the IAM Role being assumed.',
          optional: true,
        },
        role_arn: {
          type: 'string',
          description:
            'Amazon Resource Name of an IAM Role to assume prior to making API calls.',
          optional: true,
        },
        session_name: {
          type: 'string',
          description: 'Identifier for the assumed role session.',
          optional: true,
        },
        tags: {
          type: 'object',
          description: 'Assume role session tags.',
          optional: true,
        },
        transitive_tag_keys: {
          type: 'object',
          description:
            'Assume role session tag keys to pass to any subsequent sessions.',
          optional: true,
        },
      },
    },
    default_tags: {
      nesting_mode: 'list',
      max_items: 1,
      properties: {
        tags: {
          type: 'object',
          description: 'Resource tags to default across all resources',
          optional: true,
        },
      },
    },
    endpoints: {
      nesting_mode: 'set',
      properties: {
        accessanalyzer: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        acm: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        acmpca: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        amplify: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        apigateway: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        applicationautoscaling: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        applicationinsights: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        appmesh: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        appstream: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        appsync: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        athena: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        auditmanager: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        autoscaling: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        autoscalingplans: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        backup: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        batch: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        budgets: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloud9: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudformation: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudfront: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudhsm: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudsearch: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudtrail: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudwatch: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudwatchevents: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cloudwatchlogs: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codeartifact: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codebuild: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codecommit: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codedeploy: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codepipeline: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        codestarconnections: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cognitoidentity: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cognitoidp: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        configservice: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        connect: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        cur: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        dataexchange: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        datapipeline: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        datasync: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        dax: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        detective: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        devicefarm: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        directconnect: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        dlm: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        dms: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        docdb: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ds: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        dynamodb: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ec2: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ecr: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ecrpublic: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ecs: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        efs: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        eks: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        elasticache: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        elasticbeanstalk: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        elastictranscoder: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        elb: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        emr: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        emrcontainers: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        es: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        firehose: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        fms: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        forecast: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        fsx: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        gamelift: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        glacier: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        globalaccelerator: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        glue: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        greengrass: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        guardduty: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        iam: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        identitystore: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        imagebuilder: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        inspector: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        iot: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        iotanalytics: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        iotevents: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kafka: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kinesis: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kinesisanalytics: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kinesisanalyticsv2: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kinesisvideo: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        kms: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        lakeformation: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        lambda: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        lexmodels: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        licensemanager: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        lightsail: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        macie: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        macie2: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        managedblockchain: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        marketplacecatalog: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mediaconnect: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mediaconvert: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        medialive: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mediapackage: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mediastore: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mediastoredata: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mq: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        mwaa: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        neptune: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        networkfirewall: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        networkmanager: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        opsworks: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        organizations: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        outposts: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        personalize: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        pinpoint: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        pricing: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        qldb: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        quicksight: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ram: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        rds: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        redshift: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        resourcegroups: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        resourcegroupstaggingapi: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        route53: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        route53domains: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        route53resolver: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        s3: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        s3control: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        s3outposts: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        sagemaker: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        sdb: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        secretsmanager: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        securityhub: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        serverlessrepo: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        servicecatalog: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        servicediscovery: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        servicequotas: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ses: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        shield: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        signer: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        sns: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        sqs: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ssm: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        ssoadmin: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        stepfunctions: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        storagegateway: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        sts: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        swf: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        synthetics: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        timestreamwrite: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        transfer: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        waf: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        wafregional: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        wafv2: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        worklink: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        workmail: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        workspaces: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
        xray: {
          type: 'string',
          description: 'Use this to override the default service endpoint URL',
          optional: true,
        },
      },
    },
    ignore_tags: {
      nesting_mode: 'list',
      max_items: 1,
      properties: {
        key_prefixes: {
          type: 'object',
          description:
            'Resource tag key prefixes to ignore across all resources.',
          optional: true,
        },
        keys: {
          type: 'object',
          description: 'Resource tag keys to ignore across all resources.',
          optional: true,
        },
      },
    },
  },
  title: 'aws_provider',
  type: 'object',
};
