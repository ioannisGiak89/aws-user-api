jest.mock('aws-sdk');
jest.mock('./src/upsertUser');
jest.mock('./src/schemaValidator');
jest.mock('./src/handlerFactory');
const AWS = require('aws-sdk');
const upsertUser = require('./src/upsertUser');
const schemaValidator = require('./src/schemaValidator');
const handlerFactory = require('./src/handlerFactory');

const user = require('./src/user.json');
const { handler } = require('./index');

describe('index', () => {
    it('should initialise the handler', async () => {
        const mockedUpsertUserFun = jest.fn();
        const schemaValidatorFun = jest.fn();
        const mockedDynamoDbClient = AWS.DynamoDB.mock.instances[0];
        const mockedAwsEvent = { body: 'Request body' };
        handlerFactory.mockImplementation(async () => 'Mocked!');
        upsertUser.mockImplementation(() => mockedUpsertUserFun);
        schemaValidator.mockImplementation(() => schemaValidatorFun);

        await handler(mockedAwsEvent);

        expect(AWS.DynamoDB).toHaveBeenCalledWith({
            apiVersion: '2012-08-10',
        });
        expect(schemaValidator).toHaveBeenCalledWith(user);
        expect(upsertUser).toHaveBeenCalledWith(mockedDynamoDbClient);
        expect(handlerFactory).toHaveBeenCalledWith({
            event: mockedAwsEvent,
            upsertUserFunc: mockedUpsertUserFun,
            schemaValidatorFunc: schemaValidatorFun,
        });
    });
});
