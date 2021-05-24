const handlerFactory = require('./handlerFactory');

describe('handlerFactory', () => {
    it('should catch any errors', async () => {
        let response = await handlerFactory({
            deleteUserFunc: jest.fn().mockRejectedValue(new Error('Table is missing')),
            event: {
                pathParameters: {},
            },
        });

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'Please provide an ID',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        response = await handlerFactory({
            deleteUserFunc: jest.fn().mockRejectedValue(new Error('Table is missing')),
            event: {
                pathParameters: { id: 'testId' },
            },
        });

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'Table is missing',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
