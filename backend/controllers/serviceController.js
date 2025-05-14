import Service from '../models/Service.js';

// Get all services for the logged-in service provider
export async function getMyServices(req, res) {
    try {
        const services = await Service.find({ provider: req.user._id });
        
        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
}

// Get a specific service by ID
export async function getServiceById(req, res) {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if the service belongs to the logged-in user
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this service'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service',
            error: error.message
        });
    }
}

// Create a new service
export async function createService(req, res) {
    try {
        // Add logged-in user as the provider
        req.body.provider = req.user._id;
        
        // Add image path if file was uploaded
        if (req.file) {
            req.body.image = `/uploads/services/${req.file.filename}`;
        }

        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating service',
            error: error.message
        });
    }
}

// Update an existing service
export async function updateService(req, res) {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if the service belongs to the logged-in user
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }
        
        // Add image path if file was uploaded
        if (req.file) {
            req.body.image = `/uploads/services/${req.file.filename}`;
        }

        service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating service',
            error: error.message
        });
    }
}

// Toggle service status (active/inactive)
export async function toggleServiceStatus(req, res) {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if the service belongs to the logged-in user
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        // Toggle the status
        service.status = service.status === 'active' ? 'inactive' : 'active';
        await service.save();

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error toggling service status',
            error: error.message
        });
    }
}

// Delete a service
export async function deleteService(req, res) {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if the service belongs to the logged-in user
        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting service',
            error: error.message
        });
    }
}