import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role // Include role in token
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
