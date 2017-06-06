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
            <Container>
                <Switch>
                    <Route exact path="/page" component={List} />
                    <Route exact path="/page/add" component={Add} />
                    <Route exact path="/page/edit/:guid" component={Edit} />
                    <Route exact path="/page/view/:guid/:slug" component={Item} />
                    <Route component={NotFound} />
                </Switch>
            </Container>

        )
    }
}