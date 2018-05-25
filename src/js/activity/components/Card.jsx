import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import NewsCard from "../../news/components/Card"
import BlogCard from "../../blog/components/Card"
import DiscussionCard from "../../discussions/components/Card"
import QuestionCard from "../../questions/components/Card"
import StatusUpdateCard from "../../group/components/StatusUpdateCard"
import WikiCard from "../../wiki/components/Card"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        if (!entity) {
            return (
                <div />
            )
        }

        switch (entity.object.subtype) {
            case "news":
                return (
                    <NewsCard entity={entity.object} inActivityFeed={true} />
                )
            case "blog":
                return (
                    <BlogCard entity={entity.object} group={entity.group} inActivityFeed={true} />
                )
            case "discussion":
                return (
                    <DiscussionCard entity={entity.object} group={entity.group} inActivityFeed={true} />
                )
            case "question":
                return (
                    <QuestionCard entity={entity.object} group={entity.group} inActivityFeed={true} />
                )
            case "thewire":
                return (
                    <StatusUpdateCard entity={entity.object} group={entity.group} inActivityFeed={true} />
                )
            case "wiki":
                return (
                    <WikiCard entity={entity.object} group={entity.group} inActivityFeed={true} />
                )
            default:
                return (
                    <div></div>
                )
        }
    }
}