const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      username: 'pablo',
      password: await bcrypt.hash('1234', 10),
      email: 'pablo@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'cami',
      password: await bcrypt.hash('1234', 10),
      email: 'email2@example2.co',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'John Smith',
      password: await bcrypt.hash('password', 10),
      email: 'email3@example3.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Jane Smith',
      password: await bcrypt.hash('password', 10),
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
