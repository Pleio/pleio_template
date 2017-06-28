import React from "react"
import { ApolloProvider } from "react-apollo"
import Router from "./Router"
import client from "./lib/client"

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Router />
            </ApolloProvider>
        )
    }
}