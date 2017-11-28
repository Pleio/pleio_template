import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import NewsCard from "../../news/components/Card"
import BlogCard from "../../blog/components/Card"
import QuestionCard from "../../questions/components/Card"
import EventCard from "../../events/components/Card"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        if (!this.props.entity) {
            return (
                <div></div>
            )
        }

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
            case "event":
                return (
                    <EventCard entity={this.props.entity} inActivityFeed={true} />
                )
            default:
                return (
                    <div></div>
                )
        }
    }
}