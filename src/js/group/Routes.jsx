import React from "react"
import { Route, Switch } from "react-router-dom"
import Container from "../core/components/Container"

import List from "./List"
import Add from "./Add"
import Edit from "./Edit"
import Item from "./Item"
import Info from "./Info"
import Invitations from "./Invitations"
import BlogGroupList from "../blog/GroupList"
import BlogAdd from "../blog/Add"
import BlogEdit from "../blog/Edit"
import BlogGroupItem from "../blog/GroupItem"
import QuestionsGroupList from "../questions/GroupList"
import QuestionsAdd from "../questions/Add"
import QuestionsEdit from "../questions/Edit"
import QuestionsGroupItem from "../questions/GroupItem"
import EventsGroupList from "../events/GroupList"
import EventsAdd from "../events/Add"
import EventsEdit from "../events/Edit"
import EventsGroupItem from "../events/GroupItem"
import FilesGroupList from "../files/GroupList"
import WikiGroupList from "../wiki/GroupList"
import WikiAdd from "../wiki/Add"
import WikiEdit from "../wiki/Edit"
import WikiGroupItem from "../wiki/GroupItem"
import TasksGroupList from "../tasks/GroupList"
import TasksEdit from "../tasks/Edit"
import TasksAdd from "../tasks/Add"
import SearchGroupResults from "../search/GroupResults"
import NotFound from "../core/NotFound"

export default class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/groups/add" component={Add} />
                <Route exact path="/groups/edit/:guid" component={Edit} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/add" component={BlogAdd} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/edit/:guid" component={BlogEdit} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/add" component={QuestionsAdd} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/edit/:guid" component={QuestionsEdit} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/events/add" component={EventsAdd} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/events/edit/:guid" component={EventsEdit} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/add" component={WikiAdd} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/edit/:guid" component={WikiEdit} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/tasks/add" component={TasksAdd} />
                <Route exact path="/groups/view/:groupGuid/:groupSlug/tasks/edit/:guid" component={TasksEdit} />
                <Container>
                    <Switch>
                        <Route exact path="/groups" component={List} />
                        <Route exact path="/groups/info/:guid" component={Info} />
                        <Route exact path="/groups/invitations" component={Invitations} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug" component={Item} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog" component={BlogGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/blog/view/:guid/:slug" component={BlogGroupItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions" component={QuestionsGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/questions/view/:guid/:slug" component={QuestionsGroupItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events" component={EventsGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/events/view/:guid/:slug" component={EventsGroupItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/files" component={FilesGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/files/:containerGuid" component={FilesGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki" component={WikiGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/wiki/view/:guid/:slug" component={WikiGroupItem} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/tasks" component={TasksGroupList} />
                        <Route exact path="/groups/view/:groupGuid/:groupSlug/search/results" component={SearchGroupResults} />
                        <Route component={NotFound} />
                    </Switch>
                </Container>
            </Switch>
        )
    }
}