require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { supabase } = require('./supabase')

exports.handler = async (req, res) => {
  // just post requsitions
  if(req.httpMethod != 'POST'){
    return{
      statusCode: 405,
      body: 'method not allowed'
    }
  }

  try{

    //getting email and password from body
    const {email,password} = JSON.parse(req.body)

    // if not have email or password return
    if(!email || !password){
      return {
        statusCode: 400, 
        body: JSON.stringify({ message: 'Email e senha são obrigatórios.' })
      };
    }

    // getting from database Users where requisition's body email are equals from database
    const { data, error } = await supabase
    .from('Users')
    .select('*') 
    .eq('email', email);

    // if database return some error, return the error
    if (error) {
      console.error('Erro na consulta:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Erro ao buscar usuário.' })
      };
    }

    // if database return a empty array, return no data
    if(!data[0] || data[0].lenght){
      return {
          statusCode:401,
          body: JSON.stringify({message: 'sem dados'})
      }
    }

    //id and password from user
    userId = data[0].id
    hashedPasswordFromDB = data[0].password
    
    //comparing the requisitions body password and hashed password from database
    const match = await bcrypt.compare(password, hashedPasswordFromDB)

    //if the passwords are the same, return the token to client
    if (match){
      const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRES)
      })

      return{
        statusCode: 200,
        body: JSON.stringify({"token":token})
      }
    }

    // else return invalid credencials 
    return{
        statusCode: 401,
        body: JSON.stringify({message:"invalid credencials"})
    }


  } catch (error){
      // returning server error
      return{
        statusCode: 400,
        body: JSON.stringify({
          message: error.message
        })
      }
    }

}