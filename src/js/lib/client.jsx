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
    shouldBatch: true,
    dataIdFromObject: o => {
        if (o.guid) {
            return o.guid
        } else if (o.id) {
            return "access:" + o.id
        } else {
            return null
        }
    }
})

export default client