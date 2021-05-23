const AWS = require('aws-sdk');
const cleanDynamoTable = require('../../testUtils/cleanDynamoTable');
const addTestUsersToDynamoTable = require('../../testUtils/addTestUsersToDynamoTable');
const handlerFactory = require('./handlerFactory');
const getUsers = require('./getUsers');
const transformUsers = require('./transformUsers');
require('dotenv').config();

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    accessKeyId: 'a',
    secretAccessKey: 'b',
    region: 'eu-west-1',
    endpoint: 'http://localhost:4566',
});

const getUsersFunc = getUsers(documentClient);
const transformUsersFunc = transformUsers();
const TableName = process.env.TABLE_NAME;

describe('get user lambda', () => {
    beforeAll(async () => {
        await cleanDynamoTable(documentClient);
    });

    afterAll(() => cleanDynamoTable(documentClient));

    it('should return 200 and an empty list', async () => {
        const { Count, Items } = await documentClient
            .scan({
                TableName,
            })
            .promise();

        const response = await handlerFactory({
            getUsersFunc,
            transformUsersFunc,
        });

        expect(Count).toEqual(0);
        expect(response).toEqual({
            statusCode: 200,
            body: transformUsersFunc(Items),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
    it('should return 200 and a list with all the the users', async () => {
        await addTestUsersToDynamoTable(documentClient);
        const { Count, Items } = await documentClient
            .scan({
                TableName,
            })
            .promise();

        const response = await handlerFactory({
            getUsersFunc,
            transformUsersFunc,
        });

        expect(Count).toEqual(3);
        expect(response).toEqual({
            statusCode: 200,
            body: transformUsersFunc(Items),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
