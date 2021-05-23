const transformUsers = () => (users) =>
    users
        ? users.map((user) => ({
              id: user.id.S,
              email: user.email.S,
              created: user.created.S,
              givenName: user.givenName.S,
              familyName: user.familyName.S,
          }))
        : [];

module.exports = transformUsers;
