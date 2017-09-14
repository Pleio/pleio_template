import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "../core/components/Container"

import Profile from "./Profile"
import Interests from "./Interests"
import Settings from "./Settings"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Container>
                <Switch>
                    <Route exact path="/profile/:username" component={Profile} />
                    <Route exact path="/profile/:username/interests" component={Interests} />
                    <Route exact path="/profile/:username/settings" component={Settings} />
                    <Route component={NotFound} />
                </Switch>
            </Container>
        )
    }
}