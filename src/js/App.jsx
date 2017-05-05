import React from "react"
import { ApolloProvider } from "react-apollo";
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { currentLanguage, modal, search } from "./lib/reducers"
import Router from "./Router"
import client from "./lib/client"

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

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client} store={store}>
                <Router />
            </ApolloProvider>
        )
    }
}