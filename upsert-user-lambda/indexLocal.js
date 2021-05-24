const AWS = require('aws-sdk');
const handlerFactory = require('./src/handlerFactory');
const upsertUser = require('./src/upsertUser');
const user = require('./src/user.json');
const schemaValidator = require('./src/schemaValidator');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/`,
});

const upsertUserFunc = upsertUser(documentClient);
const schemaValidatorFunc = schemaValidator(user);

const handler = async (event) =>
    handlerFactory({
        event,
        upsertUserFunc,
        schemaValidatorFunc,
    });

exports.handler = handler;
