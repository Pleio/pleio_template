import React from "react"
import { Link } from "react-router"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import BlogCard from "../../blog/components/Card"

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
        const { guid, image, title, tags } = this.props.entity.object

        return (
            <div className="card-tile-container">
                <Link to={`/news/${guid}`} className={classnames({"card-tile ___full-image ___small-card": true, "___no-image": (image ? false : true), [getClassFromTags(tags)]: true})}>
                    <div className="card-tile__content">
                        <h3 className="card-tile__title">
                            {title}
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
            <div className="card-topic ___feed">
                <a href="#" title="Ester Verschut" style={{backgroundImage: "url(/mod/pleio_template/src/content/john.png)"}} className="card-topic__picture"></a>
                <div className="card-topic__post">
                    <a href="forum-bericht.html" className="card-topic__title">
                        Beëindiging van een koop- en licentieovereenkomst
                    </a>
                    <div className="card-topic__meta">
                        <span>Gesteld door:&nbsp;</span><a href="#" className="card-topic__user">Ester Verschut</a>&nbsp;5 min geleden<span>&nbsp;in&nbsp;</span>
                        <a href="#" className="card-topic__subject">Kwaliteit</a>
                    </div>
                    <div className="card-topic__content">
                        DGA staat op de loonlijst en ontvangt vanuit zijn werkmaatschappij € 57.500,- bruto loon. De medewerker met het hoogste salaris in de werkmaatschappij verdient hoogste salaris in de werkmaatschappij verdient.
                    </div>
                </div>
                <div className="card-topic__actions">
                    <a href="forum-bericht.html" className="card-topic__comments">16 antwoorden</a>
                    <div title="Bewaar" data-toggle-bookmark="" className="button__text count-bookmarks">
                        <span data-toggle-bookmark="number">12</span>
                    </div>
                </div>
            </div>
        )
    }
}