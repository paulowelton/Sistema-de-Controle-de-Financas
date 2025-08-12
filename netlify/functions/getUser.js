const {verifyJWT} = require('./auth')
const { supabase } = require('./supabase');

exports.handler = async (event) => {
    const authResult = verifyJWT(event)
    
    if(!authResult.isValid){
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Invalid token'})
        }
    }
        
    id = authResult.decoded.id

    try{
                
        const { data: user, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', id)

        if(error){
            return {
                statusCode: 400,
                body: JSON.stringify({message: error})
            }
        }
        
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