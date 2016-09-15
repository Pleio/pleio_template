import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

import ApolloClient, { createNetworkInterface } from 'apollo-client'

import Routes from './Routes'

import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { currentLanguage } from './lib/Reducers'
import { readCookie } from './lib/cookies'

const networkInterface = createNetworkInterface('/graphql', {
    credentials: 'same-origin',
    headers: {
        'X-CSRF-Token': readCookie('CSRF_TOKEN')
    }
})

const client = new ApolloClient({ networkInterface })

let store = createStore(combineReducers({
    currentLanguage: currentLanguage,
    apollo: client.reducer()
}), {
    currentLanguage: "nl"
}, applyMiddleware(client.middleware()))

ReactDOM.render((
    <ApolloProvider client={client} store={store}>
        <Routes />
    </ApolloProvider>
), document.getElementById("skip-navigation"))