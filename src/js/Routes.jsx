import React from "react"
import { Router, Route, IndexRoute, browserHistory } from "react-router"
import { connect } from "react-redux"

import Container from "./core/components/Container"

import NotFound from "./core/NotFound"
import ForgotPasswordConfirm from "./core/ForgotPasswordConfirm"
import Login from "./core/Login"
import Logout from "./core/Logout"
import Search from "./core/Search"

import ActivityList from "./activity/List"

import BlogList from "./blog/List"

import NewsList from "./news/List"
import NewsItem from "./news/Item"

import QuestionsList from "./questions/List"

import BookmarksList from "./bookmarks/List"

import ProfileWrapper from "./profile/components/Wrapper"
import Profile from "./profile/Profile"
import Account from "./profile/Account"
import Settings from "./profile/Settings"

export default class Routes extends React.Component {
    render() {
        return (
            <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
                <Route path="/" component={Container}>
                    <IndexRoute component={ActivityList} />
                    <Route path="/blog" component={BlogList} />
                    <Route path="/news">
                        <IndexRoute component={NewsList} />
                        <Route path="/news/:guid" component={NewsItem} />
                    </Route>
                    <Route path="/forum" component={QuestionsList} />
                    <Route path="/bookmarks" component={BookmarksList} />
                    <Route path="/search" component={Search} />
                    <Route path="/resetpassword" component={ForgotPasswordConfirm} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/profile/:username" component={ProfileWrapper}>
                        <IndexRoute component={Profile} />
                        <Route path="account" component={Account} />
                        <Route path="settings" component={Settings} />
                    </Route>
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}