import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import Container from './components/Container'

import Activity from './views/Activity'
import Blog from './views/Blog'
import NewsList from './views/NewsList'
import NewsItem from './views/NewsItem'
import Forum from './views/Forum'
import Bookmarks from './views/Bookmarks'
import Search from './views/Search'
import NotFound from './views/NotFound'
import ForgotPasswordConfirmModal from './views/ForgotPasswordConfirmModal'
import LoginModal from "./views/LoginModal"

export default class Routes extends React.Component {
    render() {
        return (
            <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
                <Route path="/" component={Container}>
                    <IndexRoute component={Activity} />
                    <Route path="/activity" component={Activity} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/news" component={NewsList} />
                    <Route path="/news/:guid" component={NewsItem} />
                    <Route path="/forum" component={Forum} />
                    <Route path="/bookmarks" component={Bookmarks} />
                    <Route path="/search" component={Search} />
                    <Route path="/resetpassword" component={ForgotPasswordConfirmModal} />
                    <Route path="/login" component={LoginModal} />
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}