import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import fetch from "isomorphic-fetch"
import moment from "moment"
import client from "./lib/client"
import "moment/locale/nl";
import Routes from "./Routes"

import { ApolloProvider } from "react-apollo";
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { currentLanguage, modal } from "./lib/reducers"

const lang = "nl"

let store = createStore(combineReducers({
    currentLanguage,
    modal,
    apollo: client.reducer()
}), {
    currentLanguage: lang,
    modal: null
}, compose(applyMiddleware(client.middleware()), window.devToolsExtension ? window.devToolsExtension() : f => f))

moment.locale(lang)

ReactDOM.render((
    <ApolloProvider client={client} store={store}>
        <Routes />
    </ApolloProvider>
), document.getElementById("react-root"))