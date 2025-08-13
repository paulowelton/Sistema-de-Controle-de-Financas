require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyJWT = (event) => {
  // getting authorization from header
  const authHeader = event.headers?.authorization || event.headers?.Authorization

  console.log('Authorization header:', authHeader)

  // if there's not header, return 
  if (!authHeader) {
    return {
      isValid: false,
      statusCode: 401,
      body: JSON.stringify({ message: 'No token provided.' }),
    }
  }

  // user token
  const token = authHeader.replace('Bearer ', '')

  try {
    // informations from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // returning token informations and if the token iws valid or not
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
