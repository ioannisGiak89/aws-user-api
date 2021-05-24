const AWS = require('aws-sdk');
const cleanDynamoTable = require('../../testUtils/cleanDynamoTable');
const addTestUsersToDynamoTable = require('../../testUtils/addTestUsersToDynamoTable');
const scanDynamoTable = require('../../testUtils/scanDynamoTable');
const handlerFactory = require('./handlerFactory');
const upsertUser = require('./upsertUser');
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

const upsertUserFunc = upsertUser(documentClient);
const schemaValidatorFunc = schemaValidator(user);

describe('create user lambda', () => {
    beforeAll(() => cleanDynamoTable(documentClient));
    afterAll(() => cleanDynamoTable(documentClient));

    it('should return 400 if the request body is missing or is invalid', async () => {
        let response = await handlerFactory({
            event: {
                body: null,
            },
            upsertUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'No data!',
            }),
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
            upsertUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid data!',
            }),
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
            upsertUserFunc,
            schemaValidatorFunc,
        });

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'User added!',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { Count } = await scanDynamoTable(documentClient, {
            ExpressionAttributeValues: {
                ':e': {
                    S: 'testUser@gmail.com',
                },
            },
            FilterExpression: 'email = :e',
        });

        expect(Count).toEqual(1);
    });

    it('should update an item if user exists', async () => {
        await addTestUsersToDynamoTable(documentClient);
        const { Items } = await scanDynamoTable(documentClient);
        const userToUpdate = Items[0];

        const response = await handlerFactory({
            event: {
                body: JSON.stringify({
                    id: userToUpdate.id.S,
                    email: userToUpdate.email.S,
                    givenName: userToUpdate.givenName.S,
                    created: userToUpdate.created.S,
                    familyName: 'New name',
                }),
            },
            upsertUserFunc,
            schemaValidatorFunc,
        });

        const result = await scanDynamoTable(documentClient, {
            ExpressionAttributeValues: {
                ':id': {
                    S: userToUpdate.id.S,
                },
            },
            FilterExpression: 'id = :id',
        });

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({
                message: 'User added!',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(result.Items[0]).toEqual({ ...userToUpdate, familyName: { S: 'New name' } });
    });
});
