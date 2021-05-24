jest.mock('aws-sdk');
jest.mock('./src/deleteUser.js');
jest.mock('./src/handlerFactory');
const AWS = require('aws-sdk');
const deleteUser = require('./src/deleteUser');
const handlerFactory = require('./src/handlerFactory');

const { handler } = require('./index');

describe('index', () => {
    it('should initialise the handler', async () => {
        const mockedDeleteUserFun = jest.fn();
        const mockedDynamoDbClient = AWS.DynamoDB.mock.instances[0];
        handlerFactory.mockImplementation(async () => 'Mocked!');
        deleteUser.mockImplementation(() => mockedDeleteUserFun);
        const mockedAwsEvent = { body: 'Request body' };

        await handler(mockedAwsEvent);

        expect(AWS.DynamoDB).toHaveBeenCalledWith({
            apiVersion: '2012-08-10',
        });
        expect(deleteUser).toHaveBeenCalledWith(mockedDynamoDbClient);
        expect(handlerFactory).toHaveBeenCalledWith({
            event: mockedAwsEvent,
            deleteUserFunc: mockedDeleteUserFun,
        });
    });
});
