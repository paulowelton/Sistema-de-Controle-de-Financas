const { verifyJWT } = require('./auth')
const { supabase } = require('./supabase')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST'){
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed.' })
    }
  }

  const { isValid, decoded, statusCode, body } = verifyJWT(event)

  if (!isValid){
    return {
      statusCode,
      body
    }
  }

  const id = decoded.id

  const { type, value, source, forma_pagamento, description } = JSON.parse(event.body)
  
  try{
    const { error } = await supabase
    .from('Amounts')
    .insert({user_id: id, type: type, value: value, source: source, forma_pagamento: forma_pagamento, description: description})

    if (error){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Amount inserted successfully.' })
    }
  
  }catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: error})
    }
  }

  
}