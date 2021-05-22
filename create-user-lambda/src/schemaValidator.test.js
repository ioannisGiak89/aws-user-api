const user = require('./user.json');
const schemaValidator = require('./schemaValidator');

describe('validator', () => {
    const schemaValidatorFunc = schemaValidator(user);

    it('should return no errors if request is correct', () => {
        expect(
            schemaValidatorFunc({
                email: 'testPostman@gmail.com',
                givenName: 'PostMan',
                familyName: 'Asthana',
            })
        ).toEqual([]);

        expect(
            schemaValidatorFunc({
                email: 'testPostman@gmail.com',
                givenName: 'PostMan',
                familyName: 'Asthana',
                id: 'ac8f025f-9143-4aec-b4bf-164f67bd4f00',
                created: '2021-05-21T10:03:05.424Z',
            })
        ).toEqual([]);
    });

    it('should return the errors if the body request is not', () => {
        expect(schemaValidatorFunc({ email: 'testPostman@gmail.com' })).not.toEqual([]);
        expect(schemaValidatorFunc({ givenName: 'PostMan' })).not.toEqual([]);
        expect(
            schemaValidatorFunc({ givenName: 'PostMan', email: 'testPostman@gmail.com' })
        ).not.toEqual([]);
        expect(schemaValidatorFunc()).not.toEqual([]);
    });
});
