import "../less/style.less"
import "core-js/shim"

import React from "react"
import ReactDOM from "react-dom"
import client from "./lib/client"
import Routes from "./Routes"

import { ApolloProvider } from "react-apollo";
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { currentLanguage, modal, search } from "./lib/reducers"
import { Router, browserHistory } from "react-router"

const lang = "nl"

let initialStore = {
    currentLanguage: lang,
    modal: null,
    search: ""
}

if (window.__STORE__) {
    initialStore = window.__STORE__
}

const store = createStore(combineReducers({
    currentLanguage,
    modal,
    search,
    apollo: client.reducer()
}), initialStore, compose(applyMiddleware(client.middleware()), window.devToolsExtension ? window.devToolsExtension() : f => f))

ReactDOM.render((
    <ApolloProvider client={client} store={store}>
        <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory} routes={Routes} />
    </ApolloProvider>
), document.getElementById("react-root"))