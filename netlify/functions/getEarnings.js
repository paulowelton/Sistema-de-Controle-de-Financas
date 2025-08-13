const {verifyJWT} = require('./auth')
const { supabase } = require('./supabase')

exports.handler = async (event) => {
    // checking token 
    const authResult = verifyJWT(event)
    
    // if token is not valid, it return 401
    if(!authResult.isValid){
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Invalid token'})
        }
    }
    
    // getting user id
    id = authResult.decoded.id

    try{
        
        // making a query for return all users
        const { data: earnings, error } = await supabase
        .from('Earnings')
        .select('*')
        .eq('user_id', id)

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
            body: JSON.stringify({earnings: earnings})
        }
    
    }catch (error){
        return {
            statusCode: 400,
            body: JSON.stringify({message: error})
        }
    }
}