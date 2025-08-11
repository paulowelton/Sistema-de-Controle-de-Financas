const { supabase } = require('./supabase');
const bcrypt = require('bcryptjs')

exports.handler = async (req) => {
    if (req.httpMethod !== 'POST') {
        return {
            statusCode: 405, 
            body: JSON.stringify({ message: 'Método não permitido.' })
        };
    }

    try {

        const { email, password } = JSON.parse(req.body);

        if (!email || !password) {
            return {
                statusCode: 400, 
                body: JSON.stringify({ message: 'Email e senha são obrigatórios.' })
            };
        }

        hashedPassword = await bcrypt.hash(password, 10)

        const { error } = await supabase
        .from('Users')
        .insert({ email: email, password: hashedPassword })

        // const { data, error } = await supabase.auth.signUp({
        //     email: email,
        //     password: password
        // });

        // const { data, error } = await supabase
        // .from('Users')
        // .select('*')
        // return{
        //     statusCode:200,
        //     body: JSON.stringify({message: data.message})
        // }

        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            };
        }

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