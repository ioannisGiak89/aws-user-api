const handlerFactory = async ({ event, deleteUserFunc }) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (!event.pathParameters.id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Please provide an ID',
            }),
            headers,
        };
    }

    try {
        const result = await deleteUserFunc(event.pathParameters.id);

        if (!result.Attributes) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found!',
                }),
                headers,
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User deleted!',
            }),
            headers,
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.message,
            }),
            headers,
        };
    }
};

module.exports = handlerFactory;
