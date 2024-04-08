import { model, Schema, InferSchemaType } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const settingSchema = new Schema({
    language: {
        type: String,
        required: false,
        default: 'text',
    },
    editable: {
        type: Boolean,
        required: false,
        default: true,
    },
    expireAt: {
        type: Number,
        required: false,
        default: 0,
    },
} , {
    _id: false, // don't include _id in the schema
});

const pasteSchema = new Schema({
    key: {
        type: String,
        required: false,
        index: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    settings: settingSchema,
}, {
    timestamps: true, 
    
});


export type Paste = InferSchemaType<typeof pasteSchema>;


// pasteSchema.index({ 'settings.validTill': 1 }, { expireAfterSeconds: 0 });

// pre middleware  - runs before running saving the document
pasteSchema.pre("save", async function (next) {
    if (!this.key) {
        this.key = uuidv4().substring(0,15).replaceAll('-', '');
    }

    if (!this.settings) {
        this.settings = {};
    }
    next();
});


// post middleware - runs after saving the document
pasteSchema.post('save', function () {
    console.log(`Paste saved: ${this.key}`);
});

export default model<Paste>('Paste', pasteSchema);
