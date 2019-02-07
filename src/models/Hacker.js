import mongoose from 'mongoose';

let hackerSchema = mongoose.Schema(
    {
        email_address: String,
        password: String,
        salt: String,
        first_name: String,
        last_name: String,
        gender: String,
        dob: String,
        school: String,
        phone_number: String,
        github: String,
        linkedin: String,
        website: String,
        description: String,
        avatar: String,
        promo_email: Boolean,
        resume: String,
        acceptance_code: String,
        confirmed: Boolean,
        declined: Boolean
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

export default mongoose.model('Hacker', hackerSchema);