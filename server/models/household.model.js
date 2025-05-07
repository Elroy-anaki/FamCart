import mongoose, {Schema, model} from 'mongoose';
import { nanoid } from 'nanoid'

const householdSchema = new Schema({
    householdName: {
        type: String,
        required: true
    },

    householdMembers: [{type: mongoose.Schema.Types.ObjectId,
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

/** @type {import('mongoose').Model<import('mongoose').Document>} */
const Household = model("Households", householdSchema);

export default Household;