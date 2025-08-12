const { verifyJWT } = require('./auth')

exports.handler = async (event) => {
    const authResult = verifyJWT(event)

    try {
        return {
            statusCode: 200,
            body: JSON.stringify({ isValid: authResult.isValid, message: authResult})
        }

    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: error.message })
        }
    }
}
