const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} = require("graphql")

const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const utils = require("./utils")
const google = require("./google")
const model = require("./models/models")
const {db} = require("./models/connection")

utils.SendNotification()


const PurchasedProductType = new GraphQLObjectType({
    name: "Product",
    fields: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        details: {type: GraphQLString},
        delivery_fee: {type: GraphQLFloat},
        number: {type: GraphQLInt},
        created_at: {type: new GraphQLNonNull(GraphQLString)},
        modified_at: {type: new GraphQLNonNull(GraphQLString)},
    }
})

const authPayLoad = new GraphQLObjectType({
    name: "authPayLoad",
    fields: {
        token: {type: new GraphQLNonNull(GraphQLString)}
    }
})

const RoutQueryType = new GraphQLObjectType({
    name: "RoutQueryType",
    type: "Query",
    description: "Root Query",
    fields: () => ({
        list_purchased_product: {
            type: new GraphQLList(PurchasedProductType),
            description: "List of purchased products",
            args: {
                user_id: {type: GraphQLInt}
            },
            resolve: (_, args) => model.GetPurchasedProductsById(args.user_id)
        }
    }),
})

const RootMutation = new GraphQLObjectType({
    name: "RootMutationType",
    type: "Mutation",
    fields: {
        loginGoogle: {
            type: authPayLoad,
            args: {
                code: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parentValue, args) => {
                try {
                    let access_token = google.GetAccessTokenFromCode(args.code)
                    let profile = google.GetGoogleUserInfo(access_token)
                    let user = model.GetUserBySocialID(profile.id)

                    if (!user) {
                        user = model.GetUserByEmail(profile.email)
                        if (!user) {
                            user = model.CreateUserByEmail(profile.email, profile.name)
                        }
                        model.CreateSocialNetwork(user.id, profile.id, "google")
                    }

                    return {"token": utils.JWTAuth(user)}
                } catch (e) {
                    throw new Error("Error when login with Google", e)
                }
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RoutQueryType,
    mutation: RootMutation
})

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}))
app.listen(4001)
console.log('Running a GraphQL API server at http://localhost:4001/graphql')