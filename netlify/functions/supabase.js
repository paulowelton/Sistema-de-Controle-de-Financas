require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// creating connection to database
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// exporting connection
module.exports = { supabase }