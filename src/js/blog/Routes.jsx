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
                <Route exact path="/blog/add" component={Add} />
                <Route exact path="/blog/edit/:guid" component={Edit} />
                <Container>
                    <Switch>
                        <Route exact path="/blog" component={List} />
                        <Route exact path="/blog/view/:guid/:slug" component={Item} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
            </Switch>
        )
    }
}