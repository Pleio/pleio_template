import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import Container from './elements/Container'

import Activity from './pages/Activity'
import Blog from './pages/Blog'
import NewsList from './pages/NewsList'
import NewsItem from './pages/NewsItem'
import Forum from './pages/Forum'
import Bookmarks from './pages/Bookmarks'
import Search from './pages/Search'
import NotFound from './pages/NotFound'

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
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}