import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { ApolloProvider } from "react-apollo"
import Router from "./Router"
import client from "./lib/client"
import pleioReducer from "./lib/reducer"

const store = createStore(
    combineReducers({
        pleio: pleioReducer,
        apollo: client.reducer()
    }),
    {},
    compose(
        applyMiddleware(client.middleware()),
        (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
)

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client} store={store}>
                <Router />
            </ApolloProvider>
        )
    }
}