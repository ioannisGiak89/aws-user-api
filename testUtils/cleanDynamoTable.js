require('dotenv').config();

const TableName = process.env.TABLE_NAME;

const cleanDynamoTable = async (documentClient) => {
    const { Items, Count } = await documentClient.scan({ TableName }).promise();

    if (Count === 0) {
        return;
    }

    const batchDeleteRequests = Items.map((user) => ({
        DeleteRequest: {
            Key: {
                id: user.id,
            },
        },
    }));

    await documentClient
        .batchWriteItem({
            RequestItems: {
                [TableName]: batchDeleteRequests,
            },
        })
        .promise();
};

module.exports = cleanDynamoTable;
