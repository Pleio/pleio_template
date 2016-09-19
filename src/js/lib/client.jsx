import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { readCookie } from './cookies'

const networkInterface = createNetworkInterface('/graphql', {
    credentials: 'same-origin',
    headers: {
        'X-CSRF-Token': readCookie('CSRF_TOKEN')
    }
})

const client = new ApolloClient({
    networkInterface,
    shouldBatch: true
})

export default client