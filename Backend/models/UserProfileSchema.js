import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    Image: {
        type: URL,
        required: true
    },
    Name:{
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
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
        required: true
    },
    DoB: {
    type: String,
    default: "00-00-0000"
}

})

const UserProfile = mongoose.model('UserProfile', ProfileSchema);

export default UserProfile;