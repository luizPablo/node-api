import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
const PostSchema = new Schema({

    text: {
        type: String,
        required: true,
        maxlength: 280,
    },
    date: {
        type: Date,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    likes: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    }],
});

PostSchema.plugin(mongoosePaginate);

export default mongoose.model('post', PostSchema);