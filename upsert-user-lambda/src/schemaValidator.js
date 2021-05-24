const Ajv = require('ajv');

const schemaValidator = (schema) => (requestBody) => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    validate(requestBody);

    return validate.errors || [];
};

module.exports = schemaValidator;
