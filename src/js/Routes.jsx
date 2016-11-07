import React from "react"
import { Router, Route, IndexRoute, browserHistory } from "react-router"
import { connect } from "react-redux"

import AbsoluteContainer from "./core/components/AbsoluteContainer"
import Container from "./core/components/Container"

import NotFound from "./core/NotFound"
import ForgotPasswordConfirm from "./core/ForgotPasswordConfirm"
import Login from "./core/Login"
import Logout from "./core/Logout"

import Campagne from "./pages/Campagne"

import ActivityList from "./activity/List"

import BlogList from "./blog/List"
import BlogItem from "./blog/Item"

import NewsList from "./news/List"
import NewsItem from "./news/Item"

import QuestionsIndex from "./questions/Index"
import QuestionsList from "./questions/List"
import QuestionsItem from "./questions/Item"

import TrendingList from "./trending/List"

import BookmarksList from "./bookmarks/List"

import SearchResults from "./search/Results"

import ProfileWrapper from "./profile/components/Wrapper"
import Profile from "./profile/Profile"
import Account from "./profile/Account"
import Settings from "./profile/Settings"

import Test from "./Test"

export default class Routes extends React.Component {
    render() {
        return (
            <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
                <Route path="/" component={Container}>
                    <IndexRoute component={ActivityList} />
                    <Route path="/blog">
                        <IndexRoute component={BlogList} />
                        <Route path="/blog/:guid" component={BlogItem} />
                    </Route>
                    <Route path="/news">
                        <IndexRoute component={NewsList} />
                        <Route path="/news/:guid" component={NewsItem} />
                    </Route>
                    <Route path="/questions">
                        <IndexRoute component={QuestionsIndex} />
                        <Route path="/questions/all" component={QuestionsList} />
                        <Route path="/questions/:guid" component={QuestionsItem} />
                    </Route>
                    <Route path="/bookmarks" component={BookmarksList} />
                    <Route path="/trending/:tag" component={TrendingList} />
                    <Route path="/test" component={Test} />
                    <Route path="/search" component={SearchResults} />
                    <Route path="/resetpassword" component={ForgotPasswordConfirm} />
                    <Route path="/profile/:username" component={ProfileWrapper}>
                        <IndexRoute component={Profile} />
                        <Route path="account" component={Account} />
                        <Route path="settings" component={Settings} />
                    </Route>
                </Route>
                <Route path="/" component={AbsoluteContainer}>
                    <Route path="/campagne" component={Campagne} />
                </Route>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/" component={Container}>
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}