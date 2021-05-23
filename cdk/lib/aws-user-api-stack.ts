import * as cdk from '@aws-cdk/core';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import { RestApi, LambdaIntegration, Resource } from '@aws-cdk/aws-apigateway';
import { Function as LambdaFunction, Runtime, AssetCode } from '@aws-cdk/aws-lambda';

export class AwsUserApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const TABLE_NAME: string | undefined = process.env.TABLE_NAME;

        if (!TABLE_NAME) {
            throw new Error('Please provide a table name in you env file');
        }

        const api: RestApi = new RestApi(this, 'user-api', {
            restApiName: 'User API',
            description: 'Provides a CRUD API for users',
            deploy: true,
            deployOptions: {
                stageName: process.env.AWS_ENV,
            },
        });

        const createLambda: LambdaFunction = new LambdaFunction(this, 'CreateLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: new AssetCode('create-user-lambda'),
            handler: process.env.AWS_ENV === 'local' ? 'indexLocal.handler' : 'index.handler',
            environment: {
                TABLE_NAME,
            },
        });

        const getUserLambda: LambdaFunction = new LambdaFunction(this, 'GetUserLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: new AssetCode('get-user-lambda'),
            handler: process.env.AWS_ENV === 'local' ? 'indexLocal.handler' : 'index.handler',
            environment: {
                TABLE_NAME,
            },
        });

        const createUserIntegration: LambdaIntegration = new LambdaIntegration(createLambda, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const getUserIntegration: LambdaIntegration = new LambdaIntegration(getUserLambda, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const userPath: Resource = api.root.addResource('user');
        userPath.addMethod('PUT', createUserIntegration);
        userPath.addMethod('GET', getUserIntegration);

        const table = new Table(this, TABLE_NAME, {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            tableName: TABLE_NAME,
        });

        table.grantWriteData(createLambda);
        table.grantReadData(getUserLambda);
    }
}
