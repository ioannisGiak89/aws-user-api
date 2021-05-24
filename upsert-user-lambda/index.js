const AWS = require('aws-sdk');
const upsertUser = require('./src/upsertUser');
const user = require('./src/user.json');
const schemaValidator = require('./src/schemaValidator');
const handlerFactory = require('./src/handlerFactory');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
});

const handler = async (event) => {
    const upsertUserFunc = upsertUser(documentClient);
    const schemaValidatorFunc = schemaValidator(user);

    return handlerFactory({
        event,
        upsertUserFunc,
        schemaValidatorFunc,
    });
};

exports.handler = handler;
