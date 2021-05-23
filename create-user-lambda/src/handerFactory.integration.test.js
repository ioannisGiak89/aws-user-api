const AWS = require('aws-sdk');
const cleanDynamoTable = require('../../testUtils/cleanDynamoTable');
const handlerFactory = require('./handlerFactory');
const addUser = require('./addUser');
const schemaValidator = require('./schemaValidator');
const user = require('./user.json');
require('dotenv').config();

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: 'a',
    secretAccessKey: 'b',
    region: 'eu-west-1',
    endpoint: 'http://localhost:4566',
});

const addUserFunc = addUser(documentClient);
const schemaValidatorFunc = schemaValidator(user);

const TableName = process.env.TABLE_NAME;

describe('create user lambda', () => {
    beforeEach(() => cleanDynamoTable(documentClient));

    it('should return 400 if the request body is missing or is invalid', async () => {
        let response = await handlerFactory({
            event: {
                body: null,
            },
            addUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 400,
            body: {
                message: 'No data!',
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        response = await handlerFactory({
            event: {
                body: JSON.stringify({
                    email: 'testPostman@gmail.com',
                    givenName: 'PostMan',
                }),
            },
            addUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 400,
            body: {
                message: 'Invalid data!',
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should return 200 if the user is created and user should be in the table', async () => {
        const response = await handlerFactory({
            event: {
                body: JSON.stringify({
                    email: 'testUser@gmail.com',
                    givenName: 'Tester',
                    familyName: 'BestTesters',
                }),
            },
            addUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 200,
            body: {
                message: 'User added!',
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { Count } = await documentClient
            .scan({
                TableName,
                ExpressionAttributeValues: {
                    ':e': {
                        S: 'testUser@gmail.com',
                    },
                },
                FilterExpression: 'email = :e',
            })
            .promise();

        expect(Count).toEqual(1);
    });
});
