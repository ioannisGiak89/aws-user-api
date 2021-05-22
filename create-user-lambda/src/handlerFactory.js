const { isEmpty } = require('lodash');

const handlerFactory = async ({ event, addUserFunc, schemaValidatorFunc }) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (!event.body) {
        return {
            statusCode: 400,
            body: {
                message: 'No data!',
            },
            headers,
        };
    }

    try {
        const requestBody = JSON.parse(event.body);

        if (!isEmpty(schemaValidatorFunc(requestBody))) {
            return {
                statusCode: 400,
                body: {
                    message: 'Invalid data!',
                },
                headers,
            };
        }

        await addUserFunc(requestBody);
    } catch (error) {
        return {
            statusCode: 400,
            body: {
                message: error.message,
            },
            headers,
        };
    }

    return {
        statusCode: 200,
        body: {
            message: 'User added!',
        },
        headers,
    };
};

module.exports = handlerFactory;
