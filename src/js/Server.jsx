import React from "react"
import { renderToString } from "react-dom/server"
import { match, RouterContext } from "react-router"
import client from "./lib/client"
import Routes from "./Routes"
import { ApolloProvider } from "react-apollo"
import { getDataFromTree } from "react-apollo/server"

export function render(location) {
    let output

    match({routes: Routes, location}, (error, redirect, renderProps) => {
        const app = (
            <ApolloProvider client={client}>
                <RouterContext {...renderProps} />
            </ApolloProvider>
        )

        output = getDataFromTree(app).then((context) => {
            return {
                status: 200,
                redirectLocation: null,
                content: renderToString(app),
                store: context.store.getState()
            }
        })
    })

    return output
}