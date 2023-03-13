const express = require('express')
const app = express()
const port = 5000;
const connectToMongo = require('./db');

connectToMongo();

app.use(express.json())


//Available routes
app.use('/api/auth',require('./routes/auth'))
// app.use('./api/notes',require('./routes/notes'))


app.listen(port ,()=>{
    console.log(`server started on ${port}`)
})