const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/isAuth')

const app = express()

app.use(bodyParser.json())

app.use(isAuth)


app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}))

mongoose.connect(process.env.MONGO_URL, {
    
})
.then(()=>console.log('MongoDB connected.'))
.catch((err)=>console.log(err))


app.listen(4000)
