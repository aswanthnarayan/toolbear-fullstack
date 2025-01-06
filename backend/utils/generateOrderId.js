import { v4 as uuidv4 } from 'uuid';

export const generateOrderId = async () => {
    // Generate a UUID and take first 6 characters
    const uuid = uuidv4().substring(0, 6);
    // Create order ID in format ORDR-XXXXXXXX
    return `ORDR-${uuid.toUpperCase()}`;
};