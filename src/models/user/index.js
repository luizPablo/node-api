import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
const UserSchema = new Schema({

    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url_image: {
        type: String,
    },
    following: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    }],
});

UserSchema.plugin(mongoosePaginate);

export default mongoose.model('user', UserSchema);