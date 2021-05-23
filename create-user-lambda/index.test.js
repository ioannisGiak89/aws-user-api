jest.mock('aws-sdk');
jest.mock('./src/addUser');
jest.mock('./src/schemaValidator');
jest.mock('./src/handlerFactory');
const AWS = require('aws-sdk');
const addUser = require('./src/addUser');
const schemaValidator = require('./src/schemaValidator');
const handlerFactory = require('./src/handlerFactory');

const user = require('./src/user.json');
const { handler } = require('./index');

describe('index', () => {
    it('should initialise all the handler', async () => {
        handlerFactory.mockImplementation(async () => 'Mocked!');

        const mockedAddUserFun = jest.fn();
        addUser.mockImplementation(() => mockedAddUserFun);

        const schemaValidatorFun = jest.fn();
        schemaValidator.mockImplementation(() => schemaValidatorFun);

        const mockedDynamoDbClient = AWS.DynamoDB.mock.instances[0];
        const mockedAwsEvent = { body: 'Request body' };

        await handler(mockedAwsEvent);

        expect(AWS.DynamoDB).toHaveBeenCalledWith({
            apiVersion: '2012-08-10',
        });
        expect(schemaValidator).toHaveBeenCalledWith(user);
        expect(addUser).toHaveBeenCalledWith(mockedDynamoDbClient);
        expect(handlerFactory).toHaveBeenCalledWith({
            event: mockedAwsEvent,
            addUserFunc: mockedAddUserFun,
            schemaValidatorFunc: schemaValidatorFun,
        });
    });
});
