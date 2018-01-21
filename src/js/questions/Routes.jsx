import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "../core/components/Container"

import List from "./List"
import Add from "./Add"
import Edit from "./Edit"
import Item from "./Item"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/questions/add" component={Add} />
                <Route exact path="/questions/edit/:guid" component={Edit} />
                <Container>
                    <Switch>
                        <Route exact path="/questions" component={List} />
                        <Route exact path="/questions/view/:guid/:slug" component={Item} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
            </Switch>
        )
    }
}