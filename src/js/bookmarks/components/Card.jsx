import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import autobind from "autobind-decorator"
import classnames from "classnames"
import NewsCard from "../../news/components/Card"
import DiscussionCard from "../../discussions/components/Card"
import BlogCard from "../../blog/components/Card"
import QuestionCard from '../../questions/components/Card'
import EventCard from '../../events/components/Card'
import StatusUpdateCard from '../../group/components/StatusUpdateCard'
import WikiCard from "../../wiki/components/Card"

export default class Card extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { entity } = this.props

        if (!entity) {
            return (
                <div />
            )
        }

        switch (entity.subtype) {
            case "news":
                return (
                    <NewsCard entity={entity} inActivityFeed={true} />
                )
            case "blog":
                return (
                    <BlogCard entity={entity} inActivityFeed={true} />
                )
            case "discussion":
                return (
                    <DiscussionCard entity={entity} inActivityFeed={true} />
                )
            case "question":
                return (
                    <QuestionCard entity={entity} inActivityFeed={true} />
                )
            case "event":
                return (
                    <EventCard entity={entity} inActivityFeed={true} />
                )
            case "thewire":
                return (
                    <StatusUpdateCard entity={entity} inActivityFeed={true} />
                )
            case "wiki":
                return (
                    <WikiCard entity={entity} inActivityFeed={true} />
                )
            default:
                return (
                    <div />
                )
        }
    }
}