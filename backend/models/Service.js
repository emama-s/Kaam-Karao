import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Service category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Service price is required'],
        min: [0, 'Price cannot be negative']
    },
    priceType: {
        type: String,
        enum: ['hourly', 'fixed'],
        required: [true, 'Price type is required']
    },
    location: {
        type: String,
        required: [true, 'Service location is required'],
        trim: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/500'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Service provider is required']
    }
}, { 
    timestamps: true 
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;