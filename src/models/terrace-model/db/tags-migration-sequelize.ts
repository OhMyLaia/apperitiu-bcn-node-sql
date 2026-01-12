import { QueryInterface, DataTypes } from "sequelize";

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.addColumn('terraces', 'tags', {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {}
        });

        await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_terraces_tags_all ON terraces 
            USING GIN (
            (tags->'cover'),
            (tags->'dietary'),
            (tags->'emotional'),
            (tags->'food'),
            (tags->'placement')
            )`);

        // await queryInterface.sequelize.query(`
        // CREATE INDEX idx_terraces_tags_cover ON terraces USING GIN ((tags->'cover'))`);

        // await queryInterface.sequelize.query(`
        // CREATE INDEX idx_terraces_tags_dietary ON terraces USING GIN ((tags->'dietary'))`);

        // await queryInterface.sequelize.query(`
        // CREATE INDEX idx_terraces_tags_emotional ON terraces USING GIN ((tags->'emotional'))`);

        // await queryInterface.sequelize.query(`
        // CREATE INDEX idx_terraces_tags_food ON terraces USING GIN ((tags->'food'))`);

        // await queryInterface.sequelize.query(`
        // CREATE INDEX idx_terraces_tags_placement ON terraces USING GIN ((tags->'placement'))`);

    },

    async down(queryInterface: QueryInterface) {
        // Remove indexes first (reverse order)
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_food_cover');
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_placement');
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_food');
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_emotional');
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_dietary');
        await queryInterface.removeIndex('terraces', 'idx_terraces_tags_cover');

        // Finally remove the column
        await queryInterface.removeColumn('terraces', 'tags');
    }
};