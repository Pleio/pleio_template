import React from "react"
import ReactDOM from "react-dom"
import ApolloClient from "apollo-client"
import { ApolloProvider } from "react-apollo"
import Filters from "./admin/Filters"
import Footer from "./admin/Footer"

const client = new ApolloClient()

if (document.getElementById("pleio-template-admin-filters")) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Filters />
        </ApolloProvider>,
        document.getElementById("pleio-template-admin-filters")
    )  
}

if (document.getElementById("pleio-template-admin-footer")) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Footer />
        </ApolloProvider>,
        document.getElementById("pleio-template-admin-footer")
    )  
}