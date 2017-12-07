import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

import UserCard from "../../core/components/UserCard"
import GroupCard from "../../group/components/Card"
import NewsCard from "../../news/components/Card"
import BlogCard from "../../blog/components/Card"
import QuestionCard from "../../questions/components/Card"
import DiscussionCard from "../../discussions/components/Card"
import EventCard from "../../events/components/Card"
import WikiCard from "../../wiki/components/Card"
import FolderCard from "../../files/components/FolderCard"
import FileCard from "../../files/components/FileCard"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        if (!this.props.entity) {
            return (
                <div />
            )
        }

        switch (this.props.entity.__typename) {
            case "User":
                return (
                    <UserCard entity={this.props.entity} inActivityFeed={true} />
                )
                break
            case "Group":
                return (
                    <GroupCard entity={this.props.entity} inActivityFeed={true} />
                )
                break
            case "Object":
                switch (this.props.entity.subtype) {
                    case "news":
                        return (
                            <NewsCard entity={this.props.entity} inActivityFeed={true} />
                        )
                    case "blog":
                        return (
                            <BlogCard entity={this.props.entity} inActivityFeed={true} />
                        )
                    case "question":
                        return (
                            <QuestionCard entity={this.props.entity} inActivityFeed={true} />
                        )
                    case "discussion":
                        return (
                            <DiscussionCard entity={this.props.entity} inActivityFeed={true} />
                        )
                    case "event":
                        return (
                            <EventCard entity={this.props.entity} inActivityFeed={true} />
                        )
                    case "folder":
                        return (
                            <FolderCard entity={this.props.entity} />
                        )
                    case "file":
                        return (
                            <FileCard entity={this.props.entity} />
                        )
                    case "wiki":
                        return (
                            <WikiCard entity={this.props.entity} />
                        )
                }
                break
        }

        return (
            <div />
        )
    }
}