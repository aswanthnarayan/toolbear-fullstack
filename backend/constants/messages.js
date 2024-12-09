const MessageEnum = Object.freeze({
    Auth: Object.freeze({
        EMAIL_IN_USE: 'Email is already in use',
        PHONE_IN_USE: 'Phone is already in use',
        INVALID_CREDENTIALS: 'Invalid email or password',
        OTP_SENT: 'OTP sent successfully',
        OTP_VERIFIED: 'OTP verified successfully',
        INVALID_OTP: 'Invalid or expired OTP',
        PASSWORD_CHANGED: 'Password changed successfully',
        LOGOUT_SUCCESS: 'Logged out successfully',
        ACCOUNT_CREATED: 'Account created successfully',
        USER_NOT_FOUND: 'User not found',
        GOOGLE_SIGNUP_REQUIRED: 'Please complete your signup',
        PHONE_REQUIRED: 'Phone number is required'
    }),

    Admin: Object.freeze({
        // User related
        USER_BLOCKED: 'User blocked successfully',
        USER_UNBLOCKED: 'User unblocked successfully',
        USER_NOT_FOUND: 'User not found',

        // Category related
        CATEGORY_CREATED: 'Category created successfully',
        CATEGORY_UPDATED: 'Category updated successfully',
        CATEGORY_LISTED: 'Category listed successfully',
        CATEGORY_UNLISTED: 'Category unlisted successfully',
        CATEGORY_NOT_FOUND: 'Category not found',
        CATEGORY_EXISTS: 'Category with this name already exists',

        // Product related
        PRODUCT_CREATED: 'Product created successfully',
        PRODUCT_UPDATED: 'Product updated successfully',
        PRODUCT_LISTED: 'Product listed successfully',
        PRODUCT_UNLISTED: 'Product unlisted successfully',
        PRODUCT_NOT_FOUND: 'Product not found',
        PRODUCT_EXISTS: 'Product with this name already exists',

        // Brand related
        BRAND_CREATED: 'Brand created successfully',
        BRAND_UPDATED: 'Brand updated successfully',
        BRAND_DELETED: 'Brand deleted successfully',
        BRAND_NOT_FOUND: 'Brand not found',
        BRAND_EXISTS: 'Brand with this name already exists',
        BRAND_LISTED: 'Brand listed successfully',
        BRAND_UNLISTED: 'Brand unlisted successfully'
    }),
    Users: Object.freeze({
        ADDRESS_ADDED: 'Address added successfully'
    }),

    Brand: Object.freeze({
        CREATED: 'Brand created successfully',
        UPDATED: 'Brand updated successfully',
        DELETED: 'Brand deleted successfully',
        NOT_FOUND: 'Brand not found',
        NAME_EXISTS: 'A brand with this name already exists',
        LISTED: 'Brand listed successfully',
        UNLISTED: 'Brand unlisted successfully',
        REQUIRED_FIELDS: 'Name, description, and offer percentage are required',
        INVALID_OFFER: 'Offer percentage must be between 0 and 100',
        REQUIRED_IMAGES: 'Logo and at least one banner image are required'
    }),

    Validation: Object.freeze({
        REQUIRED_FIELD: 'This field is required',
        INVALID_EMAIL: 'Please enter a valid email',
        INVALID_PHONE: 'Please enter a valid phone number',
        INVALID_PASSWORD: 'Password must be at least 6 characters',
        PASSWORDS_NOT_MATCH: 'Passwords do not match',
        INVALID_FILE: 'Invalid file type',
        ALL_FIELDS_REQUIRED: 'All fields are required',
        INVALID_PRICE: 'Price must be a valid positive number',
        INVALID_STOCK: 'Stock must be a valid non-negative number',
        INVALID_OFFER_PERCENTAGE: 'Offer percentage must be between 0 and 100',
        INVALID_SPECIFICATIONS: 'Invalid specifications format',
        MAIN_IMAGE_REQUIRED: 'Main product image is required',
        MAX_ADDITIONAL_IMAGES_EXCEEDED: 'Maximum 3 additional images allowed',
        VALIDATION_ERROR: 'Validation error'
    }),

    Error: Object.freeze({
        INTERNAL_SERVER_ERROR: 'An internal server error occurred',
        DATABASE_ERROR: 'Database operation failed',
        UPLOAD_ERROR: 'File upload failed',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden'
    })
});

export default MessageEnum;