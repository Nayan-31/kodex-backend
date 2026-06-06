import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'super_secret_dev_key_only', {
        expiresIn: '60m'
    })
}
