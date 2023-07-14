module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('Lobbies', [
    {
      usersNumber: 0,
      userId1: null,
      userId2: null,
      userId3: null,
      userId4: null,
      user1IsReady: false,
      user2IsReady: false,
      user3IsReady: false,
      user4IsReady: false,
      gameId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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
