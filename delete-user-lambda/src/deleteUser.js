const deleteUser = (documentClient) => async (userId) =>
    documentClient
        .deleteItem({
            Key: {
                id: {
                    S: userId,
                },
            },
            TableName: process.env.TABLE_NAME,
            ReturnValues: 'ALL_OLD',
        })
        .promise();

module.exports = deleteUser;
