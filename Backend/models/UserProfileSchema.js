import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Users",
        unique: true
    },
    Image: {
        url:{
        type: String,
        default: "https://res.cloudinary.com/sinwqkak/image/upload/v1786729161/party_pic_frbs9t.jpg"
        },           
        fileName: String
    },
    Name:{
        type: String,
        required: true
    },
    Email:
    {
        type: String,
        required: true,
        unique: true
    },
    Tel: {
        type: String,
        default: "00000000000"
    },
    Address: {
        house: {
            type: String,
            default: ""
        },
        CityState: {
            type: String,
            default: ""
        }
    },
    Gender: {
        type: String,
        default: "Male"
    },
    Dob: {
    type: String,
    default: "00-00-0000"
}

})

const UserProfile = mongoose.model('UserProfile', ProfileSchema);

export default UserProfile;