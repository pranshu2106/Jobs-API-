/**
 * Parse API error responses into user-friendly messages
 */
export const parseError = (error) => {
    // Handle Axios error response
    if (error.response) {
        const { data, status } = error.response;

        // Handle Mongoose validation errors
        if (data?.msg) {
            // Mongoose validation errors are comma-separated
            const messages = data.msg.split(',').map((msg) => msg.trim());
            return {
                message: messages[0],
                messages,
                status,
                isValidation: messages.length > 1,
            };
        }

        // Handle generic error messages
        if (data?.message) {
            return {
                message: data.message,
                messages: [data.message],
                status,
                isValidation: false,
            };
        }

        // Default based on status code
        const statusMessages = {
            400: 'Invalid request. Please check your input.',
            401: 'Please login to continue.',
            403: 'You do not have permission to perform this action.',
            404: 'The requested resource was not found.',
            409: 'A conflict occurred. The resource may already exist.',
            422: 'Validation failed. Please check your input.',
            429: 'Too many requests. Please try again later.',
            500: 'Server error. Please try again later.',
            502: 'Bad gateway. Please try again later.',
            503: 'Service unavailable. Please try again later.',
        };

        return {
            message: statusMessages[status] || 'An error occurred. Please try again.',
            messages: [statusMessages[status] || 'An error occurred.'],
            status,
            isValidation: false,
        };
    }

    // Handle network errors
    if (error.request) {
        return {
            message: 'Network error. Please check your internet connection.',
            messages: ['Network error. Please check your internet connection.'],
            status: 0,
            isValidation: false,
        };
    }

    // Handle other errors
    return {
        message: error.message || 'An unexpected error occurred.',
        messages: [error.message || 'An unexpected error occurred.'],
        status: null,
        isValidation: false,
    };
};

/**
 * Format validation errors for form display
 */
export const formatValidationErrors = (errorMessage) => {
    if (!errorMessage) return {};

    const errors = {};
    const messages = errorMessage.split(',').map((msg) => msg.trim());

    messages.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();

        // Map error messages to field names
        if (lowerMsg.includes('name')) {
            errors.name = msg;
        } else if (lowerMsg.includes('email')) {
            errors.email = msg;
        } else if (lowerMsg.includes('password')) {
            errors.password = msg;
        } else if (lowerMsg.includes('company')) {
            errors.company = msg;
        } else if (lowerMsg.includes('position')) {
            errors.position = msg;
        } else if (lowerMsg.includes('status')) {
            errors.status = msg;
        } else {
            // Generic error
            errors.general = msg;
        }
    });

    return errors;
};
