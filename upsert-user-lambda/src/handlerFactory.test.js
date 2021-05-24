const handlerFactory = require('./handlerFactory');

describe('handlerFactory', () => {
    it('should catch any errors', async () => {
        let response = await handlerFactory({
            event: {
                body: JSON.stringify({
                    email: 'testUser@gmail.com',
                    givenName: 'Tester',
                    familyName: 'BestTesters',
                }),
            },
            upsertUserFunc: jest.fn().mockRejectedValue(new Error('Table is missing')),
            schemaValidatorFunc: jest.fn().mockReturnValue([]),
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

        response = await handlerFactory({
            event: {
                body: '\n',
            },
            upsertUserFunc: jest.fn(),
            schemaValidatorFunc: jest.fn(),
        });

        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
                message: 'Unexpected end of JSON input',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
