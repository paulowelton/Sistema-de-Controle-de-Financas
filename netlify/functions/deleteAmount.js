const { supabase } = require('./supabase')

exports.handler = async (req) => {
    // this route only accept post method
    if (req.httpMethod !== 'POST') {
        return {
            statusCode: 405, 
            body: JSON.stringify({ message: 'Método não permitido.' })
        };
    }

    try{
        const { id } = JSON.parse(req.body)

        if (!id){
            return {
                statusCode: 400, 
                body: JSON.stringify({ message: 'Id do dado está faltando.' })
            }
        }

        const { error } = await supabase
        .from('Amounts')
        .delete()
        .eq('id', id)

        // if there's some error, return
        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            }
        }

        // if it dont have any error, it return status code 200
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "success"})
        }

    }catch (error){
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.', error: error.message })
        }
    }
}