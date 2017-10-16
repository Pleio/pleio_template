import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import NewsCard from "../../news/components/Card"
import BlogCard from "../../blog/components/Card"
import QuestionCard from '../../questions/components/Card'
import WireCard from "../../group/components/WireCard"

export default class Card extends React.Component {
    constructor(props) {
        super(props)

        this.renderNews = this.renderNews.bind(this)
    }

    render() {
        if (!this.props.entity) {
            return (
                <div></div>
            )
        }

        switch (this.props.entity.object.subtype) {
            case "news":
                return this.renderNews()
            case "blog":
                return (
                    <BlogCard entity={this.props.entity.object} inActivityFeed={true} />
                )
            case "question":
                return (
                    <QuestionCard entity={this.props.entity.object} inActivityFeed={true} />
                )
            case "thewire":
                return (
                    <WireCard entity={this.props.entity.object} inActivityFeed={true} />
                )
            default:
                return (
                    <div></div>
                )
        }
    }

    renderNews() {
        const activity = this.props.entity
        const { object } = activity

        return (
            <NewsCard entity={this.props.entity.object} inActivityFeed={true} />
        )
    }
}