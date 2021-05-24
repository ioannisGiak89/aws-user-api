const AWS = require('aws-sdk');
const cleanDynamoTable = require('../../testUtils/cleanDynamoTable');
const addTestUsersToDynamoTable = require('../../testUtils/addTestUsersToDynamoTable');
const scanDynamoTable = require('../../testUtils/scanDynamoTable');
const handlerFactory = require('./handlerFactory');
const deleteUser = require('./deleteUser');
require('dotenv').config();

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: 'a',
    secretAccessKey: 'b',
    region: 'eu-west-1',
    endpoint: 'http://localhost:4566',
});

const deleteUserFunc = deleteUser(documentClient);

describe('get user lambda', () => {
    beforeAll(async () => {
        await cleanDynamoTable(documentClient);
    });

    afterAll(() => cleanDynamoTable(documentClient));

    it('should delete a user', async () => {
        await addTestUsersToDynamoTable(documentClient);
        const resultBeforeDelete = await scanDynamoTable(documentClient);

        const response = await handlerFactory({
            deleteUserFunc,
            event: {
                pathParameters: {
                    id: resultBeforeDelete.Items[0].id.S,
                },
            },
        });

        const resultAfterDeletion = await scanDynamoTable(documentClient);

        expect(resultAfterDeletion.Count).toEqual(resultBeforeDelete.Count - 1);
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted!' }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should return 404 if the user is not found', async () => {
        const response = await handlerFactory({
            deleteUserFunc,
            event: {
                pathParameters: {
                    id: 'no existing id',
                },
            },
        });

        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({
                message: 'User not found!',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
