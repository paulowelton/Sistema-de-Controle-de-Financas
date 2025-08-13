const { supabase } = require('./supabase')
const bcrypt = require('bcryptjs')

exports.handler = async (req) => {
    
    // this route only accept post method
    if (req.httpMethod !== 'POST') {
        return {
            statusCode: 405, 
            body: JSON.stringify({ message: 'Método não permitido.' })
        };
    }

    try {
        // getting email and password from body
        const { email, password } = JSON.parse(req.body);

        if (!email || !password) {
            return {
                statusCode: 400, 
                body: JSON.stringify({ message: 'Email e senha são obrigatórios.' })
            };
        }

        hashedPassword = await bcrypt.hash(password, 10)

        // inserting user in database
        const { error } = await supabase
        .from('Users')
        .insert({ email: email, password: hashedPassword })

        // if some error, return
        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            };
        }

        // returning 200
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Usuário criado com sucesso!", password: hashedPassword})
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.', error: error.message })
        };
    }
};