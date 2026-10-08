module.exports = {
up: async (queryInterface, Sequelize) => {
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('destinations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      short_description: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      country_code: {
        type: DataTypes.STRING(3),
        allowNull: false
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90
        }
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180
        }
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      currency_code: {
        type: DataTypes.STRING(3),
        allowNull: false
      },
      language_codes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      climate_info: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      best_time_to_visit: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      average_cost_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      safety_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 10
        }
      },
      popularity_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      attractions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      transportation_info: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      accommodation_info: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      visa_requirements: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      health_requirements: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      cultural_tips: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      emergency_info: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('destinations', ['latitude', 'longitude'], {
      name: 'idx_destinations_coordinates'
    });

    await queryInterface.addIndex('destinations', ['country'], {
      name: 'idx_destinations_country'
    });

    await queryInterface.addIndex('destinations', ['country_code'], {
      name: 'idx_destinations_country_code'
    });

    await queryInterface.addIndex('destinations', ['region'], {
      name: 'idx_destinations_region'
    });

    await queryInterface.addIndex('destinations', ['city'], {
      name: 'idx_destinations_city'
    });

    await queryInterface.addIndex('destinations', ['popularity_score'], {
      name: 'idx_destinations_popularity_score'
    });

    await queryInterface.addIndex('destinations', ['is_active'], {
      name: 'idx_destinations_is_active'
    });

    await queryInterface.addIndex('destinations', ['featured'], {
      name: 'idx_destinations_featured'
    });

    await queryInterface.addIndex('destinations', ['slug'], {
      name: 'idx_destinations_slug',
      unique: true
    });

    await queryInterface.addConstraint('destinations', {
      fields: ['latitude'],
      type: 'check',
      name: 'chk_destinations_latitude_range',
      where: {
        latitude: {
          [Sequelize.Op.between]: [-90, 90]
        }
      }
    });

    await queryInterface.addConstraint('destinations', {
      fields: ['longitude'],
      type: 'check',
      name: 'chk_destinations_longitude_range',
      where: {
        longitude: {
          [Sequelize.Op.between]: [-180, 180]
        }
      }
    });

    await queryInterface.addConstraint('destinations', {
      fields: ['safety_rating'],
      type: 'check',
      name: 'chk_destinations_safety_rating_range',
      where: {
        [Sequelize.Op.or]: [
          { safety_rating: null },
          { safety_rating: { [Sequelize.Op.between]: [1, 10] } }
        ]
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('destinations', 'chk_destinations_safety_rating_range');
    await queryInterface.removeConstraint('destinations', 'chk_destinations_longitude_range');
    await queryInterface.removeConstraint('destinations', 'chk_destinations_latitude_range');
    
    await queryInterface.removeIndex('destinations', 'idx_destinations_slug');
    await queryInterface.removeIndex('destinations', 'idx_destinations_featured');
    await queryInterface.removeIndex('destinations', 'idx_destinations_is_active');
    await queryInterface.removeIndex('destinations', 'idx_destinations_popularity_score');
    await queryInterface.removeIndex('destinations', 'idx_destinations_city');
    await queryInterface.removeIndex('destinations', 'idx_destinations_region');
    await queryInterface.removeIndex('destinations', 'idx_destinations_country_code');
    await queryInterface.removeIndex('destinations', 'idx_destinations_country');
    await queryInterface.removeIndex('destinations', 'idx_destinations_coordinates');
    
    await queryInterface.dropTable('destinations');
  }
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Destinations");
  }
};
