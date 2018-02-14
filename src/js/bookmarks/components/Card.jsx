import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import autobind from "autobind-decorator"
import classnames from "classnames"
import NewsCard from "../../news/components/Card"
import DiscussionCard from "../../discussions/components/Card"
import BlogCard from "../../blog/components/Card"
import QuestionCard from '../../questions/components/Card'

export default class Card extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.props.entity) {
            return (
                <div></div>
            )
        }

        switch (this.props.entity.subtype) {
            case "news":
                return this.renderNews()
            case "blog":
                return this.renderBlog()
            case "discussion":
                return this.renderDiscussion()
            case "question":
                return this.renderQuestion()
            default:
                return (
                    <div></div>
                )
        }
    }

    @autobind
    renderNews() {
        const activity = this.props.entity
        const { object } = activity

        return (
            <NewsCard entity={this.props.entity} inActivityFeed={true} />
        )
    }

    @autobind
    renderBlog() {
        return (
            <BlogCard entity={this.props.entity} inActivityFeed={true} />
        )
    }

    @autobind
    renderDiscussion() {
        return (
            <DiscussionCard entity={this.props.entity} inActivityFeed={true} />
        )
    }

    @autobind
    renderQuestion() {
        return (
            <QuestionCard entity={this.props.entity} inActivityFeed={true} />
        )
    }
}