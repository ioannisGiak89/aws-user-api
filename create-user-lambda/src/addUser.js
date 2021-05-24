const { v4: uuidv4 } = require('uuid');

const addUser = (documentClient) => async (requestBody) =>
    documentClient
        .putItem({
            TableName: process.env.TABLE_NAME,
            Item: {
                id: {
                    S: requestBody.id ? requestBody.id : uuidv4(),
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
                    S: requestBody.created ? requestBody.created : new Date().toISOString(),
                },
            },
        })
        .promise();

module.exports = addUser;
