module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      username: 'John Doe',
      password: 'password',
      email: 'email@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Jane Doe',
      password: 'password',
      email: 'email2@example2.co',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'John Smith',
      password: 'password',
      email: 'email3@example3.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Jane Smith',
      password: 'password',
      email: 'email4@example4.net',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]),
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
};
