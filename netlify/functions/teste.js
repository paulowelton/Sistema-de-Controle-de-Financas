const { supabase } = require('./supabase');

exports.handler = async (req) => {
    try{

        const { email } = JSON.parse(req.body)

        const { data, error } = await supabase
        .from('Users')
        .select('*') 
        .eq('email', email);

        if(!data[0] || data[0].lenght){
            return {
                statusCode:200,
                body: JSON.stringify({message: 'sem dados'})
            }
        }

        userId = data[0].id

        return {
            statusCode:200,
            body: JSON.stringify({message: 'Usuario encontrado', data})
        }

    }catch (error) {
        consolelog(error)
    }
}