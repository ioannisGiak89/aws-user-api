const transformUsers = require('./transformUsers');

describe('transformUsers', () => {
    it('should transform user to the right format', () => {
        const testData = [
            {
                id: { S: '6421b6ee-b00d-4649-87a1-163ba6a26a1e' },
                email: { S: 'Lauriane.Connelly@gmail.com' },
                created: { S: '2021-05-23T21:43:52.501Z' },
                givenName: { S: 'Madaline' },
                familyName: { S: 'McGlynn' },
            },
            {
                id: { S: 'f51941cd-6132-4ccb-a02e-65fc59def154' },
                email: { S: 'Mathilde93@gmail.com' },
                created: { S: '2021-05-23T21:43:52.501Z' },
                givenName: { S: 'Erin' },
                familyName: { S: 'Conn' },
            },
            {
                id: { S: 'b0cf9065-6662-4f77-bb97-add34add0f6a' },
                email: { S: 'Jakob.Sanford59@hotmail.com' },
                created: { S: '2021-05-23T21:43:52.501Z' },
                givenName: { S: 'Sedrick' },
                familyName: { S: 'Sauer' },
            },
        ];

        const expectedData = [
            {
                id: '6421b6ee-b00d-4649-87a1-163ba6a26a1e',
                email: 'Lauriane.Connelly@gmail.com',
                created: '2021-05-23T21:43:52.501Z',
                givenName: 'Madaline',
                familyName: 'McGlynn',
            },
            {
                id: 'f51941cd-6132-4ccb-a02e-65fc59def154',
                email: 'Mathilde93@gmail.com',
                created: '2021-05-23T21:43:52.501Z',
                givenName: 'Erin',
                familyName: 'Conn',
            },
            {
                id: 'b0cf9065-6662-4f77-bb97-add34add0f6a',
                email: 'Jakob.Sanford59@hotmail.com',
                created: '2021-05-23T21:43:52.501Z',
                givenName: 'Sedrick',
                familyName: 'Sauer',
            },
        ];

        expect(transformUsers()(testData)).toEqual(expectedData);
    });

    it('should return an empty array if there is no data', () => {
        expect(transformUsers()([])).toEqual([]);
        expect(transformUsers()(null)).toEqual([]);
    });
});
