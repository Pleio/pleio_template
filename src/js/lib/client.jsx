import { print as printGraphQL } from "graphql-tag/printer"
import ApolloClient from "apollo-client"
import RecursiveIterator from "recursive-iterator"
import objectPath from "object-path"
import { readCookie } from "./cookies"

const createNetworkInterface = (url) => {
    return {
        query(request) {
            const formData = new FormData()

            for(let { node, path } of new RecursiveIterator(request.variables)) {
                if (typeof File !== "undefined" && node instanceof File) {
                    const id = Math.random().toString(36);
                    formData.append(id, node);
                    objectPath.set(request.variables, path.join("."), id);
                }
            }

            formData.append("query", printGraphQL(request.query))
            formData.append("variables", JSON.stringify(request.variables || {}))
            formData.append("debugName", JSON.stringify(request.debugName || ""))
            formData.append("operationName", JSON.stringify(request.operationName || ""));

            let headers = {}
            if (readCookie("CSRF_TOKEN")) {
                headers["X-CSRF-Token"] = readCookie("CSRF_TOKEN")
            }
            if (typeof global.COOKIES !== "undefined") {
                headers["X-Elgg"] = global.COOKIES.Elgg
            }

            return fetch(url, {
                credentials: "same-origin",
                headers,
                body: formData,
                method: "POST"
            }).then(result => result.json())
        }
    }
}

let url
if (global.SITE) {
    url = global.SITE + "graphql"
} else {
    url = "/graphql"
}

const networkInterface = createNetworkInterface(url)

const client = new ApolloClient({
    ssrMode: true,
    networkInterface,
    //shouldBatch: true,
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