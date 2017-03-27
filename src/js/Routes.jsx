import React from "react"
import { Router, Route, IndexRoute, browserHistory } from "react-router"

import Container from "./core/components/Container"
import AbsoluteContainer from "./core/components/AbsoluteContainer"

import NotFound from "./core/NotFound"
import Login from "./core/Login"
import Logout from "./core/Logout"
import Register from "./core/Register"
import ForgotPassword from "./core/ForgotPassword"
import ForgotPasswordConfirm from "./core/ForgotPasswordConfirm"

import Privacy from "./core/Privacy"
import Terms from "./core/Terms"
import Contact from "./core/Contact"

import Campagne from "./pages/Campagne"

import ActivityList from "./activity/List"

import BlogList from "./blog/List"
import BlogItem from "./blog/Item"
import BlogAdd from "./blog/Add"
import BlogEdit from "./blog/Edit"

import NewsList from "./news/List"
import NewsItem from "./news/Item"
import NewsAdd from "./news/Add"
import NewsEdit from "./news/Edit"

import PageList from "./page/List"
import PageItem from "./page/Item"

import GroupList from "./group/List"
import GroupAdd from "./group/Add"
import GroupEdit from "./group/Edit"
import GroupItem from "./group/Item"
import GroupBlogItem from "./group/GroupBlogItem"
import GroupForumItem from "./group/GroupForumItem"
import GroupFilesItem from "./group/GroupFilesItem"

import QuestionsIndex from "./questions/Index"
import QuestionsAdd from "./questions/Add.jsx"
import QuestionsEdit from "./questions/Edit.jsx"
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
        { path: "/pages/privacy", component: Privacy },
        { path: "/pages/terms", component: Terms },
        { path: "/pages/contact", component: Contact },
        { path: "/bookmarks", component: BookmarksList },
        { path: "/trending/:tag", component: TrendingList },
        { path: "/search", component: SearchResults },
        { path: "/login", component: Login },
        { path: "/logout", component: Logout },
        { path: "/register", component: Register },
        { path: "/forgotpassword", component: ForgotPassword },
        { path: "/resetpassword", component: ForgotPasswordConfirm }
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
        { path: "add", component: NewsAdd},
        { path: "edit/:guid", component: NewsEdit },
        { path: "view/:guid/:slug", component: NewsItem }
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
        { path: "add", component: BlogAdd },
        { path: "edit/:guid", component: BlogEdit },
        { path: "view/:guid/:slug", component: BlogItem }
    ]
}

const questionsRoutes = {
    path: "/questions",
    component: Container,
    indexRoute: { component: QuestionsIndex },
    childRoutes: [
        { path: "all", component: QuestionsList },
        { path: "add", component: QuestionsAdd },
        { path: "edit/:guid", component: QuestionsEdit },
        { path: "view/:guid/:slug", component: QuestionsItem }
    ]
}

const groupRoutes = {
    path: "/groups",
    component: Container,
    indexRoute: { component: GroupList },
    childRoutes: [
        { path: "all", component: GroupList },
        { path: "add", component: GroupAdd },
        { path: "edit/:guid", component: GroupEdit },
        { path: "view/:guid/:slug", component: GroupItem },
        { path: "view/:guid/:slug/blog", component: GroupBlogItem },
        { path: "view/:guid/:slug/questions", component: GroupForumItem },
        { path: "view/:guid/:slug/files", component: GroupFilesItem }
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
    childRoutes: [ routes, absoluteRoutes, pageRoutes, newsRoutes, blogRoutes, questionsRoutes, profileRoutes, groupRoutes, notFoundRoutes ]
}

export default rootRoute