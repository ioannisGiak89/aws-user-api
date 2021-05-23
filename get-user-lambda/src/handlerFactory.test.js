const handlerFactory = require('./handlerFactory');

describe('handlerFactory', () => {
    it('should catch any errors', async () => {
        const response = await handlerFactory({
            getUsersFunc: jest.fn().mockRejectedValue(new Error('Table is missing')),
            transformUsersFunc: jest.fn(),
        });

        expect(response).toEqual({
            statusCode: 400,
            body: {
                message: 'Table is missing',
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
