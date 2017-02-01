import "../less/style.less"
import "core-js/shim"

import React from "react"
import ReactDOM from "react-dom"
import { AppContainer } from "react-hot-loader"
import App from "./App"

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById("react-root")
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App)
    })
}