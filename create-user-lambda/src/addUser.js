const { v4: uuidv4 } = require('uuid');

const addUser = (documentClient) => async (requestBody) =>
    documentClient
        .putItem({
            TableName: process.env.TABLE_NAME,
            Item: {
                id: {
                    S: uuidv4(),
                },
                email: {
                    S: requestBody.email,
                },
                givenName: {
                    S: requestBody.givenName,
                },
                familyName: {
                    S: requestBody.familyName,
                },
                created: {
                    S: new Date().toISOString(),
                },
            },
        })
        .promise();

module.exports = addUser;
