import React from "react"
import { Link } from "react-router"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import BlogCard from "../../blog/components/Card"
import QuestionCard from '../../questions/components/Card'

export default class Card extends React.Component {
    constructor(props) {
        super(props)

        this.renderNews = this.renderNews.bind(this)
        this.renderBlog = this.renderBlog.bind(this)
        this.renderQuestion = this.renderQuestion.bind(this)
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
                return this.renderBlog()
            case "question":
                return this.renderQuestion()
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
            <div className="card-tile-container">
                <Link to={`/news/${object.guid}`} className={classnames({"card-tile ___full-image ___small-card": true, "___no-image": (object.image ? false : true), [getClassFromTags(object.tags)]: true})}>
                    <div className="card-tile__content">
                        <h3 className="card-tile__title">
                            {object.title}
                        </h3>
                        <div className="read-more">
                            <div className="read-more__circle"></div>
                            <span>Lees meer</span>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    renderBlog() {
        return (
            <BlogCard entity={this.props.entity.object} />
        )
    }

    renderQuestion() {
        return (
            <QuestionCard entity={this.props.entity.object} inFeed={true} />
        )
    }
}