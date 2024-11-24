import multer from 'multer';

// Configure multer for single image upload (used by categories)
export const singleUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('image');

// Configure multer for brand uploads (logo + banners)
export const brandUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banners', maxCount: 3 }
]);

// Multer error handling middleware for single upload
export const handleSingleUpload = (req, res, next) => {
    singleUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File size too large. Maximum size is 5MB'
                });
            }
            return res.status(400).json({
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
};

// Multer error handling middleware for brand upload
export const handleBrandUpload = (req, res, next) => {
    brandUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File size too large. Maximum size is 5MB'
                });
            }
            return res.status(400).json({
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
};