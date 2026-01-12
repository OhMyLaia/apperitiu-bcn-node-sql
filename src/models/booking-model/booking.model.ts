import { Model, DataTypes, DateDataType } from "sequelize";
import { sequelize } from "../../config/sequelize-config.js";
import User from "../user-model/user.model.js";
import Terrace from "../terrace-model/db/terrace-model-sequelize.js";

class Booking extends Model{
    declare id:string;
    declare booking_date:Date;
    declare booking_time:string;
    declare is_paid:boolean;
    declare party_length:number;
    declare payment_id:string|null; //aconsejado por si no existe al inicio
    declare has_shown:boolean;
    declare booking_price:number
    declare user_id:string
    declare terrace_id: string;
    static party_length: any;
    static booking_price: number;
    static id: any;
}

Booking.init(
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        booking_date:{
            type:DataTypes.DATEONLY,
            allowNull:false,
        },
        booking_time:{
            type:DataTypes.STRING,
            allowNull:false
        },
        is_paid:{
            type:DataTypes.BOOLEAN,
            allowNull:false, //a revisar
            defaultValue: false
        },
        party_length:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        payment_id:{
            type:DataTypes.STRING,//ojo con esto, puede ser null si aun no hay pago, el id me lo genera stripe
            allowNull:true,
            
        },
        has_shown:{
            type:DataTypes.BOOLEAN,
            allowNull:false,  //a revisar
            defaultValue:false
        },
        booking_price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        user_id:{
            type:DataTypes.UUID,
            allowNull:false,  //a revisar
            references:{
                model:User,
                key:'id'
            },
        },
        terrace_id:{
            type:DataTypes.UUID,
            allowNull:false,
            references:{
                model:Terrace,
                key:'id'
            }
        }
        

    },
    {
        sequelize,
        tableName:'booking',
        timestamps:true
    }
);
//relaciones
User.hasMany(Booking,{
    foreignKey:'user_id',
    sourceKey:'id'
})
Booking.belongsTo(User,{
    foreignKey:'user_id',
    targetKey:'id'
})

Terrace.hasMany(Booking,{
    foreignKey:'terrace_id',
    sourceKey:'id'
})
Booking.belongsTo(Terrace,{
    foreignKey:'terrace_id',
    targetKey:'id'
})

Booking.beforeCreate((booking) => {
  if (booking.booking_price) {
    booking.booking_price = booking.party_length * 1; // 1 euro por persona
  }
});

export default Booking

// Booking.beforeCreate('setBookingPrice',(booking) => {
//   booking.booking_price = booking.party_length * 1; 
// });
  // cata de 1 euro por persona, el before create me lo sugiere (method) Model<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes>.beforeCreate<M extends Model>(this: ModelStatic<M>, name: string, fn: (instance: M, options: CreateOptions<Attributes<M>>) => HookReturn): void (+1 overload)

// A hook that is run before creating a single instance

// @param name

// @param fn — A callback function that is called with attributes, options
// ; esto deberia ir dentro de el modelo