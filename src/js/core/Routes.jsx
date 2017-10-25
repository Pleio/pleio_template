import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "./components/Container"

import Campagne from "../Campagne"
import ActivityList from "../activity/List"
import Index from "./Index"
import Privacy from "./Privacy"
import Terms from "./Terms"
import Contact from "./Contact"
import BookmarksList from "../bookmarks/List"
import TrendingList from "../trending/List"
import Login from "./Login"
import Logout from "./Logout"
import Register from "./Register"
import ForgotPassword from "./ForgotPassword"
import ForgotPasswordConfirm from "./ForgotPasswordConfirm"
import NotFound from "./NotFound"

export default class Routes extends React.Component {
    render() {
        return (
                <Container>
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/campagne" component={Campagne} />
                        <Route exact path="/activity" component={ActivityList} />
                        <Route exact path="/pages/privacy" component={Privacy} />
                        <Route exact path="/pages/terms" component={Terms} />
                        <Route exact path="/pages/contact" component={Contact} />
                        <Route exact path="/bookmarks" component={BookmarksList} />
                        <Route exact path="/trending/:tag" component={TrendingList} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/logout" component={Logout} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <Route exact path="/resetpassword" component={ForgotPasswordConfirm} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
        )
    }
}

 