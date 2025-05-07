import {Schema} from 'mongoose';
import { nanoid } from 'nanoid'

const householdSchema = new Schema({
    householdName: {
        type: String,
        required: true
    },

    householdMembers: [{type: monggose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],

    householdBudget: {
        type: Number,
        required: true
    },

    householdShoppingCarts:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingCarts",
        required: true,
        default: []
    }],

    householdJoinCode: {
        type: String,
        required: true,
        unique: true,
        default: () => {
            return nanoid(5);
        }
    },
    
    householdOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

}, {timestamps: true});

const Household = model("Households", householdSchema);

export default Household;