import React from "react"
import { Link } from "react-router"
import Bookmark from "../../bookmarks/components/Bookmark"
import showDate from "../../lib/showDate"
import classnames from "classnames"

export default class Card extends React.Component {
    render () {
        const { entity, inFeed } = this.props

        return (
            <div className={classnames({"card-topic": true, "___feed": inFeed})}>
                <Link to={`/profile/${entity.owner.username}`} title={entity.owner.name} style={{backgroundImage: "url(" + entity.owner.icon + ")"}} className="card-topic__picture"></Link>
                <div className="card-topic__post">
                    <Link to={`/questions/${entity.guid}`} className="card-topic__title">
                        {entity.title}
                    </Link>
                    <div className="card-topic__meta">
                        <span>Gesteld door:&nbsp;</span>
                        <a href="#" className="card-topic__user">
                            {entity.owner.name}
                        </a>
                        <span>&nbsp;{showDate(entity.timeCreated)}&nbsp;</span>
                        <a href="#" className="card-topic__subject">
                            {entity.tags.length > 0 ? (" in " + entity.tags) : ""}
                        </a>
                    </div>
                    <div className="card-topic__content">
                        {entity.excerpt}
                    </div>
                </div>
                <div className="card-topic__actions">
                    <div className="card-topic__justify">
                        <div className="card-topic__views">
                            {entity.views}
                        </div>
                        <Bookmark entity={entity} />
                    </div>
                    <Link to={`/questions/${entity.guid}`} className="card-topic__comments">
                        {entity.commentCount} {(entity.commentCount === 1) ? " antwoord" : " antwoorden"}
                    </Link>
                </div>
            </div>
        )
    }
}

