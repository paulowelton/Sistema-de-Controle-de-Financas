const {verifyJWT} = require('./auth')
const { supabase } = require('./supabase')

exports.handler = async (event) => {
    // checking token 
    const authResult = verifyJWT(event)
    
    // if token is not valid, return 401
    if(!authResult.isValid){
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Invalid token'})
        }
    }
    
    // getting user id
    const id = authResult.decoded.id

    try{
        
        // making a query for return all users
        const { data: user, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', id)

        // if some error, return
        if(error){
            return {
                statusCode: 400,
                body: JSON.stringify({message: error})
            }
        }
        
        // returning user
        return {
            statusCode: 200,
            body: JSON.stringify({user: user})
        }
    
    }catch (error){
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}