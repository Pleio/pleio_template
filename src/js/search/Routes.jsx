import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "../core/components/Container"

import Results from "./Results"
import Overlay from "./Overlay"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/search" component={Overlay} />
                <Container>
                    <Switch>
                        <Route exact path="/search/results" component={Results} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
            </Switch>
        )
    }
}