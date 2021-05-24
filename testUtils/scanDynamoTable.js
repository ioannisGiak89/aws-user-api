require('dotenv').config();

const TableName = process.env.TABLE_NAME;

const scanDynamoTable = async (documentClient, props = {}) =>
    documentClient.scan({ TableName, ...props }).promise();

module.exports = scanDynamoTable;
