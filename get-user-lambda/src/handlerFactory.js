const handlerFactory = async ({ getUsersFunc, transformUsersFunc }) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const { Items } = await getUsersFunc();
        return {
            statusCode: 200,
            body: JSON.stringify(transformUsersFunc(Items)),
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
