const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const TableName = process.env.TABLE_NAME;

const addTestUsersToDynamoTable = async (documentClient) => {
    const batchPutRequests = [0, 1, 2].map(() => ({
        PutRequest: {
            Item: {
                id: {
                    S: uuidv4(),
                },
                email: {
                    S: faker.internet.email(),
                },
                givenName: {
                    S: faker.name.firstName(),
                },
                familyName: {
                    S: faker.name.lastName(),
                },
                created: {
                    S: new Date().toISOString(),
                },
            },
        },
    }));

    await documentClient
        .batchWriteItem({
            RequestItems: {
                [TableName]: batchPutRequests,
            },
        })
        .promise();
};

module.exports = addTestUsersToDynamoTable;
