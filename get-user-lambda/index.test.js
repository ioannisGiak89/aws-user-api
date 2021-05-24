jest.mock('aws-sdk');
jest.mock('./src/getUsers');
jest.mock('./src/handlerFactory');
jest.mock('./src/transformUsers');
const AWS = require('aws-sdk');
const getUsers = require('./src/getUsers');
const transformUsers = require('./src/transformUsers');
const handlerFactory = require('./src/handlerFactory');
const { handler } = require('./index');

describe('index', () => {
    it('should initialise all the handler', async () => {
        const mockedGetUsersFun = jest.fn();
        const mockedDynamoDbClient = AWS.DynamoDB.mock.instances[0];
        const mockedTransformUsersFun = jest.fn();
        handlerFactory.mockImplementation(async () => 'Mocked!');
        getUsers.mockImplementation(() => mockedGetUsersFun);
        transformUsers.mockImplementation(() => mockedTransformUsersFun);

        await handler();

        expect(AWS.DynamoDB).toHaveBeenCalledWith({
            apiVersion: '2012-08-10',
        });
        expect(transformUsers).toHaveBeenCalled();
        expect(getUsers).toHaveBeenCalledWith(mockedDynamoDbClient);
        expect(handlerFactory).toHaveBeenCalledWith({
            getUsersFunc: mockedGetUsersFun,
            transformUsersFunc: mockedTransformUsersFun,
        });
    });
});
