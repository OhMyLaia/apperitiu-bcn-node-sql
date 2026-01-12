import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize-config.js';
import { validFoodCategoryTags, validEmotionalTags, validCoverTypes, validPlacementTypes, validDietaryRestrictionTypes } from '../zod/customTerrace-schema.js';
import { tagValidator } from '../../../utils/terrace-utils/tagValidator.js';
import {defaultOpeningHours} from '../../../utils/terrace-utils/defaultOpeningHours.js';
import { UUID } from 'crypto';
//TODO find default images!!

export class Terrace extends Model {
    public id!: UUID;
    public business_name!: string;
    public cadastro_ref!: string;
    public address!: string;
    public activity_code!: number;
    public group_activity_code!: number;
    public district_name!: string;
    public district_code!: number;
    public neighbourhood_name!: string;
    public neighbourhood_code!: number;
    public opening_hours?: string;
    public zip_code?: number;
    public tables!: number;
    public seats!: number;
    public latitude!: number;
    public longitude!: number;
    public average_price?: number;
    public average_rating?: number;
    public has_wifi?: boolean;
    public pet_friendly?: boolean;
    public can_smoke?: boolean;
    public has_disabled_acces?: boolean;
    public has_kitchen?: boolean;
    public is_claimed?: boolean;
    public instagram_account?: string;
    public website?: string;
    public profile_pic?: string;
    public reservation_fee?: number;
    public tags!: {
        cover?: string[];
        dietary?: string[];
        emotional?: string[];
        food?: string[];
        placement?: string[];
    };
    public phone_num?: string;
}

Terrace.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cadastro_ref: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    activity_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group_activity_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    district_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    neighbourhood_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    neighbourhood_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tables: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    average_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    has_wifi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    pet_friendly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    can_smoke: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_disabled_access: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    has_kitchen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    reservation_fee: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    is_claimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    instagram_account: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    tags: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        get() {
            const rawValue = this.getDataValue('tags');
            return {
                cover: [],
                dietary: [],
                emotional: [],
                food: [],
                placement: [],
                ...rawValue
            };
        }
    },
    phone_num: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
},
    {
        sequelize,
        modelName: 'Terrace',
        tableName: 'terraces',
        schema: 'public',
        timestamps: false,
    }
);

export default Terrace;