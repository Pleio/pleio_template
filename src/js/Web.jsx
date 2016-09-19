import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import { polyfill } from 'es6-promise'
import moment from 'moment'
import 'moment/locale/nl';

polyfill()

import ApolloClient, { createNetworkInterface } from 'apollo-client'

import Routes from './Routes'

import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { currentLanguage, modal } from './lib/reducers'
import { readCookie } from './lib/cookies'

const networkInterface = createNetworkInterface('/graphql', {
    credentials: 'same-origin',
    headers: {
        'X-CSRF-Token': readCookie('CSRF_TOKEN')
    }
})

const lang = "nl"

const client = new ApolloClient({
    networkInterface,
    shouldBatch: true
})

let store = createStore(combineReducers({
    currentLanguage,
    modal,
    apollo: client.reducer()
}), {
    currentLanguage: lang,
    modal: null
}, applyMiddleware(client.middleware()))

moment.locale(lang)

ReactDOM.render((
    <ApolloProvider client={client} store={store}>
        <Routes />
    </ApolloProvider>
), document.getElementById("react-root"))