import "reflect-metadata";
import 'dotenv/config'
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolvers } from "./resolvers/UserResolvers";
import { createConnection } from "typeorm";

import "reflect-metadata";
// import testDb from "./utils/testDb";

(async () => {
  const app = express()

  await createConnection()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolvers]
    }),
    context: ({req,res}) => ({req,res}),
  })

  apolloServer.applyMiddleware({app})

  app.listen(4000, () => {
    console.log('App listening in port 4000')
  })
})()

// testDb()