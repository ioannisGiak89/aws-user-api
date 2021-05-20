import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsUserApi from '../lib/aws-user-api-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AwsUserApi.AwsUserApiStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {},
            },
            MatchStyle.EXACT
        )
    );
});
