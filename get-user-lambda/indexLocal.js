const AWS = require('aws-sdk');
const getUsers = require('./src/getUsers');
const transformUsers = require('./src/transformUsers');
const handlerFactory = require('./src/handlerFactory');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/`,
});

const handler = async () => {
    const getUsersFunc = getUsers(documentClient);
    const transformUsersFunc = transformUsers();

    return handlerFactory({
        getUsersFunc,
        transformUsersFunc,
    });
};

exports.handler = handler;
