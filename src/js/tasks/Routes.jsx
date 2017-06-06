import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "../core/components/Container"

import Add from "./Add"
import Edit from "./Edit"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Container>
                    <Route exact path="/tasks/add" component={Add} />
                    <Route exact path="/tasks/edit/:guid" component={Edit} />
                    <Route component={NotFound} />
                </Container>
            </Switch>
        )
    }
}