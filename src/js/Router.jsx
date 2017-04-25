import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Container from "./core/components/Container"

import Campagne from "./pages/Campagne"
import ActivityList from "./activity/List"
import Privacy from "./core/Privacy"
import Terms from "./core/Terms"
import Contact from "./core/Contact"
import BookmarksList from "./bookmarks/List"
import TrendingList from "./trending/List"
import SearchResults from "./search/Results"
import Login from "./core/Login"
import Logout from "./core/Logout"
import Register from "./core/Register"
import ForgotPassword from "./core/ForgotPassword"
import ForgotPasswordConfirm from "./core/ForgotPasswordConfirm"
import NewsList from "./news/List"
import NewsItem from "./news/Item"
import NewsAdd from "./news/Add"
import NewsEdit from "./news/Edit"
import BlogList from "./blog/List"
import BlogItem from "./blog/Item"
import BlogAdd from "./blog/Add"
import BlogEdit from "./blog/Edit"
import QuestionsIndex from "./questions/Index"
import QuestionsAdd from "./questions/Add.jsx"
import QuestionsEdit from "./questions/Edit.jsx"
import QuestionsList from "./questions/List"
import QuestionsItem from "./questions/Item"
import EventsList from "./events/List"
import EventsItem from "./events/Item"
import EventsAdd from "./events/Add"
import EventsEdit from "./events/Edit"
import PageList from "./page/List"
import PageItem from "./page/Item"
import GroupList from "./group/List"
import GroupAdd from "./group/Add"
import GroupEdit from "./group/Edit"
import GroupItem from "./group/Item"
import GroupBlogList from "./group/GroupBlogList"
import GroupBlogItem from "./group/GroupBlogItem"
import GroupQuestionsList from "./group/GroupQuestionsList"
import GroupQuestionsItem from "./group/GroupQuestionsItem"
import GroupFilesList from "./group/GroupFilesList"
import GroupEventsList from "./group/GroupEventsList"
import GroupEventsItem from "./group/GroupEventsItem"
import GroupWikiList from "./group/GroupWikiList"
import GroupWikiItem from "./group/GroupWikiItem"
import WikiEdit from "./wiki/Edit"
import WikiAdd from "./wiki/Add"

import ProfileWrapper from "./profile/components/Wrapper"
import Profile from "./profile/Profile"
import Account from "./profile/Account"
import Settings from "./profile/Settings"
import NotFound from "./core/NotFound"

export default class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Container>
                    <Switch>
                        <Route exact path="/" component={ActivityList} />
                        <Route exact path="/campagne" component={Campagne} />
                        <Route exact path="/activity" component={ActivityList} />
                        <Route exact path="/pages/privacy" component={Privacy} />
                        <Route exact path="/pages/terms" component={Terms} />
                        <Route exact path="/pages/contact" component={Contact} />
                        <Route exact path="/bookmarks" component={BookmarksList} />
                        <Route exact path="/trending/:tag" component={TrendingList} />
                        <Route exact path="/search" component={SearchResults} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/logout" component={Logout} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <Route exact path="/resetpassword" component={ForgotPasswordConfirm} />
                        <Route exact path="/news" component={NewsList} />
                        <Route exact path="/news/add" component={NewsAdd} />
                        <Route exact path="/news/edit/:guid" component={NewsEdit} />
                        <Route exact path="/news/view/:guid/:slug" component={NewsItem} />
                        <Route exact path="/blog" component={BlogList} />
                        <Route exact path="/blog/add" component={BlogAdd} />
                        <Route exact path="/blog/edit/:guid" component={BlogEdit} />
                        <Route exact path="/blog/view/:guid/:slug" component={BlogItem} />
                        <Route exact path="/questions" component={QuestionsIndex} />
                        <Route exact path="/questions/all" component={QuestionsList} />
                        <Route exact path="/questions/add" component={QuestionsAdd} />
                        <Route exact path="/questions/edit/:guid" component={QuestionsEdit} />
                        <Route exact path="/questions/view/:guid/:slug" component={QuestionsItem} />
                        <Route exact path="/events" component={EventsList} />
                        <Route exact path="/events/add" component={EventsAdd} />
                        <Route exact path="/events/edit/:guid" component={EventsEdit} />
                        <Route exact path="/events/view/:guid/:slug" component={EventsItem} />
                        <Route exact path="/page" component={PageList} />
                        <Route exact path="/page/view/:guid/:slug" component={PageItem} />
                        <Route exact path="/groups" component={GroupList} />
                        <Route exact path="/groups/add" component={GroupAdd} />
                        <Route exact path="/groups/edit/:guid" component={GroupEdit} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug" component={GroupItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog" component={GroupBlogList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/add" component={BlogAdd} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/edit/:guid" component={BlogEdit} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/view/:guid/:slug" component={GroupBlogItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions" component={GroupQuestionsList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/add" component={QuestionsAdd} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/edit/:guid" component={QuestionsEdit} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/view/:guid/:slug" component={GroupQuestionsItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/files" component={GroupFilesList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/files/:containerGuid" component={GroupFilesList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events" component={GroupEventsList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events/add" component={EventsAdd} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events/edit/:guid" component={EventsEdit} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events/view/:guid/:slug" component={GroupEventsItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki" component={GroupWikiList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/add" component={WikiAdd} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/edit/:guid" component={WikiEdit} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/view/:guid/:slug" component={GroupWikiItem} />
                        <Route exact path="/profile/:username" component={Profile} />
                        <Route exact path="/profile/:username/account" component={Account} />
                        <Route exact path="/profile/:username/settings" component={Settings} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
            </BrowserRouter>
        )
    }
}