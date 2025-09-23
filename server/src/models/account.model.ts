import { Schema, model, Document } from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.ENCRYPTION_KEY;
const algorithm = process.env.ALGORITHM_KEY;
const ivHex = process.env.ENCRYPTION_IV;

if (!secretKey || !algorithm || !ivHex) {
    throw new Error('Missing encryption environment variables');
}

const iv = Buffer.from(ivHex, 'hex');

interface IAccount {
    user_id: string;
    game?: string;
    login: string;
    password: string;
    backup_code?: string;
}

interface AccountDocument extends IAccount, Document {
    toJSON(): Record<string, any>;
}

const encryptPassword = (password: string) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    return cipher.update(password, 'utf-8', 'hex') + cipher.final('hex');
};

const decryptPassword = (encrypted: string): string => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};

const accountSchema = new Schema<AccountDocument>(
    {
        user_id: { type: String, required: true },
        game: { type: String, default: 'counter-strike-2', required: true },
        login: { type: String, required: true },
        password: { type: String, required: true },
        backup_code: { type: String },
    },
    { timestamps: true },
);

accountSchema.methods.toJSON = function () {
    const account = this.toObject();
    account.password = decryptPassword(account.password);
    return account;
};

accountSchema.pre<AccountDocument>('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = encryptPassword(this.password);
    next();
});

const Account = model<AccountDocument>('Account', accountSchema);
export default Account;
