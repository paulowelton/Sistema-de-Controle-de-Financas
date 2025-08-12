require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyJWT = (event) => {
  const authHeader = event.headers?.authorization || event.headers?.Authorization

  console.log('Authorization header:', authHeader)

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
      statusCode:200,
      body: JSON.stringify({ message: 'Token is valid.'})
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
