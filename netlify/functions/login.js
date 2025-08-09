require('dotenv').config()
// const { exprte } = require('express')
const jwt = require('jsonwebtoken')

exports.handler = async (req, res) => {
  if(req.httpMethod != 'POST'){
    return{
      statusCode: 405,
      body: 'method not allowed'
    }
  }

  try{

    const data = JSON.parse(req.body)

    if(data.name === 'paulo' && data.password === '123'){
      const id = 1
      const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRES)
      })

      return{
        statusCode: 200,
        body: JSON.stringify({"token":token})
      }
    }

    return{
        statusCode: 401,
        body: JSON.stringify({"message":"invalid credencials"})
    }


  } catch (error){
      return{
        statusCode: 400,
        body: JSON.stringify({
          message: error
        })
      }
    }

}