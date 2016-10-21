import React from "react"
import { Link } from "react-router"

export default class Card extends React.Component {
    constructor(props) {
        super(props)

        this.renderNews = this.renderNews.bind(this)
        this.renderBlog = this.renderBlog.bind(this)
        this.renderQuestion = this.renderQuestion.bind(this)
    }

    render() {
        if (!this.props.object) {
            return (
                <div></div>
            )
        }

        switch (this.props.object.subtype) {
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
        return (
            <div className="card-tile-container">
                <Link to={`/news/${this.props.object.guid}`} className="card-tile ___full-image ___small-card ___leren ___no-image">
                    <div className="card-tile__content">
                        <h3 className="card-tile__title">
                            {this.props.object.title}
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
            <div className="card-blog-post">
                <a href="#" title="Merel Beijersbergen" style="background-image: url(&quot;assets/content/john.png&quot;);" className="card-blog-post__picture"></a>
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <a href="#" className="card-blog-post__user">Merel Beijersbergen</a>
                        <span>&nbsp;over&nbsp;</span>
                        <a href="#" className="card-blog-post__subject">Inkomstenbelasting</a>
                        <div href="#" className="card-blog-post__date">14 september 2016</div>
                    </div>
                    <a href="blog-bericht-afbeelding.html" style="background-image: url('assets/content/lead-1.jpg');" className="card-blog-post__image"></a>
                    <a href="blog-bericht-afbeelding.html" className="card-blog-post__title">
                        Alle Itatur? Oditium ipiciumet endissi tatiunt lore voloriam imenti ommoditia desti quam ipsun
                    </a>
                    <div className="card-blog-post__content">
                        DGA staat op de loonlijst en ontvangt vanuit zijn werkmaatschappij € 57.500,- bruto loon. De medewerker met het hoogste salaris in de werkmaatschappij verdient hoogste salaris in de werkmaatschappij verdient.
                    </div>
                </div>
                <div className="card-blog-post__actions">
                    <div data-toggle-like="" className="button__text ___likes"><span data-toggle-like="number">14</span>&nbsp;likes</div>
                    <div title="Bewaar" data-toggle-bookmark="" className="button__text count-bookmarks"><span data-toggle-bookmark="number">12</span></div>
                </div>
            </div>
        )
    }

    renderQuestion() {
        return (
            <div className="card-topic ___feed">
                <a href="#" title="Ester Verschut" style="background-image: url(&quot;assets/content/sarah.jpg&quot;);" className="card-topic__picture"></a>
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