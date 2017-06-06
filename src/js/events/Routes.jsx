import React from "react"
import { Route, Switch } from "react-router-dom"

import List from "./List"
import Add from "./Add"
import Edit from "./Edit"
import Item from "./Item"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/events" component={List} />
                <Route exact path="/events/add" component={Add} />
                <Route exact path="/events/edit/:guid" component={Edit} />
                <Route exact path="/events/view/:guid/:slug" component={Item} />
                <Route component={NotFound} />
            </Switch>
        )
    }
}