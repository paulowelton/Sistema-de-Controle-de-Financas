require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyJWT = (req) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return {
      isValid: false,
      statusCode: 401,
      body: JSON.stringify({ message: 'No token provided.' }),
    }
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return {
      isValid: true,
      decoded: decoded,
    }
  } catch (error) {
    return {
      isValid: false,
      statusCode: 403,
      body: JSON.stringify({ message: 'Invalid or expired token.' }),
    }
  }
}

module.exports = { verifyJWT }