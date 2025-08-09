const {verifyJWT} = require('./auth')

exports.handler = async (event) => {
    const authResult = verifyJWT(event)
    
    if(!authResult.isValid){
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Invalid token'})
        }
    }

    user = {
        "name": "paulo",
        "password": 123
    }
    
    try{
        return {
            statusCode: 200,
            body: JSON.stringify({message: user})
        }
    
    }catch (error){
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}