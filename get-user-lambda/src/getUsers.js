const getUsers = (documentClient) => async () =>
    documentClient.scan({ TableName: process.env.TABLE_NAME }).promise();

module.exports = getUsers;
