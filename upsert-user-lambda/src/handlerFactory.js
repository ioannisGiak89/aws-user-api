const { isEmpty } = require('lodash');

const handlerFactory = async ({ event, upsertUserFunc, schemaValidatorFunc }) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No data!',
            }),
            headers,
        };
    }

    try {
        const requestBody = JSON.parse(event.body);

        if (!isEmpty(schemaValidatorFunc(requestBody))) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid data!',
                }),
                headers,
            };
        }

        await upsertUserFunc(requestBody);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message,
            }),
            headers,
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'User added!',
        }),
        headers,
    };
};

module.exports = handlerFactory;
