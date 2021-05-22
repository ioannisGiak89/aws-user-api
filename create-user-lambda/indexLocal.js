const AWS = require('aws-sdk');
const handlerFactory = require('./src/handlerFactory');
const addUser = require('./src/addUser');
const user = require('./src/user.json');
const schemaValidator = require('./src/schemaValidator');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/`,
});

const addUserFunc = addUser(documentClient);
const schemaValidatorFunc = schemaValidator(user);

const handler = async (event) =>
    handlerFactory({
        event,
        addUserFunc,
        schemaValidatorFunc,
    });

exports.handler = handler;
