import React from "react"
import { Router, Route, IndexRoute, browserHistory } from "react-router"

import Container from "./core/components/Container"
import AbsoluteContainer from "./core/components/AbsoluteContainer"

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

import PageList from "./page/List"
import PageItem from "./page/Item"

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

const routes = {
    path: "/",
    component: Container,
    indexRoute: { component: ActivityList },
    childRoutes: [
        { path: "/activity", component: ActivityList },
        { path: "/bookmarks", component: BookmarksList },
        { path: "/trending/:tag", component: TrendingList },
        { path: "/search", component: SearchResults },
        { path: "/resetpassword", component: ForgotPasswordConfirm },
        { path: "/logout", component: Logout }
    ]
}

const absoluteRoutes = {
    path: "/",
    component: AbsoluteContainer,
    childRoutes: [
        { path: "campagne", component: Campagne }
    ]
}

const newsRoutes = {
    path: "/news",
    component: Container,
    indexRoute: { component: NewsList },
    childRoutes: [
        { path: ":guid", component: NewsItem }
    ]
}

const pageRoutes = {
    path: "/page",
    component: Container,
    indexRoute: { component: PageList },
    childRoutes: [
        { path: "view/:guid/:slug", component: PageItem }
    ]
}

const blogRoutes = {
    path: "/blog",
    component: Container,
    indexRoute: { component: BlogList },
    childRoutes: [
        { path: ":guid", component: BlogItem }
    ]
}

const questionsRoutes = {
    path: "/questions",
    component: Container,
    indexRoute: { component: QuestionsList },
    childRoutes: [
        { path: ":guid", component: QuestionsItem }
    ]
}

const profileRoutes = {
    path: "/profile",
    component: Container,
    childRoutes: [{
        path: ":username",
        component: ProfileWrapper,
        indexRoute: { component: Profile },
        childRoutes: [
            { path: "account", component: Account },
            { path: "settings", component: Settings }
        ]
    }]
}

const notFoundRoutes = {
    path: "/",
    component: Container,
    childRoutes: [
        { path: "*", component: NotFound }
    ]
}

const rootRoute = {
    childRoutes: [ routes, absoluteRoutes, pageRoutes, newsRoutes, blogRoutes, questionsRoutes, profileRoutes, notFoundRoutes ]
}

export default rootRoute