import React from "react"
import ReactDOM from "react-dom"
import ApolloClient from "apollo-client"
import { ApolloProvider } from "react-apollo"
import Menu from "./admin/Menu"
import Profile from "./admin/Profile"
import Colors from "./admin/Colors"
import Filters from "./admin/Filters"
import Footer from "./admin/Footer"
import client from "./lib/client"

if (document.getElementById("pleio-template-admin-menu")) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Menu />
        </ApolloProvider>,
        document.getElementById("pleio-template-admin-menu")
    )
}

if (document.getElementById("pleio-template-admin-profile")) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Profile />
        </ApolloProvider>,
        document.getElementById("pleio-template-admin-profile")
    )
}

if (document.getElementById("pleio-template-admin-colors")) {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Colors />
        </ApolloProvider>,
        document.getElementById("pleio-template-admin-colors")
    )
}

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