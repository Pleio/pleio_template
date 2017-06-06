import React from "react"
import { Router as ReactRouter } from "react-router-dom"
import { Route, Switch } from "react-router-dom"
import browserHistory from "./lib/browserHistory"

import NewsRoutes from "./news/Routes"
import BlogRoutes from "./blog/Routes"
import QuestionsRoutes from "./questions/Routes"
import EventsRoutes from "./events/Routes"
import GroupRoutes from "./group/Routes"
import PageRoutes from "./page/Routes"
import TasksRoutes from "./tasks/Routes"
import ProfileRoutes from "./profile/Routes"
import CoreRoutes from "./core/Routes"
import NotFound from "./core/NotFound"

export default class Router extends React.Component {
    render() {
        return (
            <ReactRouter history={browserHistory}>
                    <Switch>
                        <Route path="/news" component={NewsRoutes} />
                        <Route path="/blog" component={BlogRoutes} />
                        <Route path="/questions" component={QuestionsRoutes} />
                        <Route path="/events" component={EventsRoutes} />
                        <Route path="/groups" component={GroupRoutes} />
                        <Route path="/page" component={PageRoutes} />
                        <Route path="/tasks" component={TasksRoutes} />
                        <Route path="/profile" component={ProfileRoutes} />
                        <Route path="/" component={CoreRoutes} />
                        <Route component={NotFound} />
                    </Switch>
            </ReactRouter>
        )
    }
}