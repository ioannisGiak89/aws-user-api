const AWS = require('aws-sdk');
const addUser = require('./src/addUser');
const user = require('./src/user.json');
const schemaValidator = require('./src/schemaValidator');
const handlerFactory = require('./src/handlerFactory');

const documentClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
});

const handler = async (event) => {
    const addUserFunc = addUser(documentClient);
    const schemaValidatorFunc = schemaValidator(user);

    return handlerFactory({
        event,
        addUserFunc,
        schemaValidatorFunc,
    });
};

exports.handler = handler;
