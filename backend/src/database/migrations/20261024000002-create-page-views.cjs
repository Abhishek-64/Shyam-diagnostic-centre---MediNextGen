'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('page_views', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      visitorId: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      path: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      deviceType: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: 'Desktop',
      },
      browser: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      os: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      referrer: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      ipHash: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('page_views', ['visitorId'], { name: 'page_views_visitor_idx' });
    await queryInterface.addIndex('page_views', ['createdAt'], { name: 'page_views_created_idx' });
    await queryInterface.addIndex('page_views', ['path'], { name: 'page_views_path_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('page_views');
  },
};
