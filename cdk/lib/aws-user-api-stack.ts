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

        const upsertUserLambda: LambdaFunction = new LambdaFunction(this, 'UpsertUserLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: new AssetCode('upsert-user-lambda'),
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

        const deleteUserLambda: LambdaFunction = new LambdaFunction(this, 'DeleteUserLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: new AssetCode('delete-user-lambda'),
            handler: process.env.AWS_ENV === 'local' ? 'indexLocal.handler' : 'index.handler',
            environment: {
                TABLE_NAME,
            },
        });

        const upsertUserIntegration: LambdaIntegration = new LambdaIntegration(upsertUserLambda, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const getUserIntegration: LambdaIntegration = new LambdaIntegration(getUserLambda, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const deleteUserIntegration: LambdaIntegration = new LambdaIntegration(deleteUserLambda, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const users: Resource = api.root.addResource('users');
        users.addMethod('PUT', upsertUserIntegration);
        users.addMethod('GET', getUserIntegration);

        const user: Resource = users.addResource('{id}');
        user.addMethod('DELETE', deleteUserIntegration);

        const table = new Table(this, TABLE_NAME, {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            tableName: TABLE_NAME,
        });

        table.grantWriteData(upsertUserLambda);
        table.grantWriteData(deleteUserLambda);
        table.grantReadData(getUserLambda);
    }
}
