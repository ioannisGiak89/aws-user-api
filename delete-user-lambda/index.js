const AWS = require('aws-sdk');
const deleteUser = require('./src/deleteUser');
const handlerFactory = require('./src/handlerFactory');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
});

const handler = async (event) => {
    const deleteUserFunc = deleteUser(documentClient);

    return handlerFactory({
        event,
        deleteUserFunc,
    });
};

exports.handler = handler;
