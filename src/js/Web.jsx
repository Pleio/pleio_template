import "../less/style.less"
import "core-js/shim"

import React from "react"
import ReactDOM from "react-dom"
import client from "./lib/client"
import Routes from "./Routes"

import { ApolloProvider } from "react-apollo";
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { currentLanguage, modal, search } from "./lib/reducers"

const lang = "nl"

let store = createStore(combineReducers({
    currentLanguage,
    modal,
    search,
    apollo: client.reducer()
}), {
    currentLanguage: lang,
    modal: null,
    search: ""
}, compose(applyMiddleware(client.middleware()), window.devToolsExtension ? window.devToolsExtension() : f => f))

ReactDOM.render((
    <ApolloProvider client={client} store={store}>
        <Routes />
    </ApolloProvider>
), document.getElementById("react-root"))