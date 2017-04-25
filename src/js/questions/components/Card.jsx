import React from "react"
import { Link } from "react-router-dom"
import Bookmark from "../../bookmarks/components/Bookmark"
import showDate from "../../lib/showDate"
import { displayTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    getRootURL() {
        const { match } = this.props

        if (!match || !match.params.groupGuid || !match.params.groupSlug) {
            return ""
        }

        return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
    }


    render () {
        const { entity, inActivityFeed } = this.props

        let actions
        if (inActivityFeed) {
            actions = (
                <div className="card-topic__actions">
                    <Link to={`${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`} className="card-topic__comments">
                        {entity.commentCount} {(entity.commentCount === 1) ? " antwoord" : " antwoorden"}
                    </Link>
                    <Bookmark entity={entity} />
                </div>
            )
        } else {
            actions = (
                <div className="card-topic__actions">
                    <div className="card-topic__justify">
                        <div className="card-topic__views">
                            {entity.views}
                        </div>
                        <Bookmark entity={entity} />
                    </div>
                    <Link to={`${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`} className="card-topic__comments">
                        {entity.commentCount} {(entity.commentCount === 1) ? " antwoord" : " antwoorden"}
                    </Link>
                </div>
            )
        }

        let tags
        if (entity.tags) {
            tags = (
                <span>
                    &nbsp;in&nbsp;
                    <Link to={`${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`} className="card-topic__subject">
                        {displayTags(entity.tags)}
                    </Link>
                </span>
            )
        }

        return (
            <div className={classnames({"card-topic": true, "___feed": inActivityFeed})}>
                <Link to={entity.owner.url} title={entity.owner.name} style={{backgroundImage: "url(" + entity.owner.icon + ")"}} className="card-topic__picture"></Link>
                <div className="card-topic__post">
                    <Link to={`${this.getRootURL()}/questions/view/${entity.guid}/${entity.title}`} className="card-topic__title">
                        {entity.title}
                    </Link>
                    <div className="card-topic__meta">
                        <span>Gesteld door:&nbsp;</span>
                        <Link to={entity.owner.url} className="card-topic__user">
                            {entity.owner.name}
                        </Link>
                        <span>&nbsp;{showDate(entity.timeCreated)}&nbsp;</span>
                        {tags}
                    </div>
                    <div className="card-topic__content">
                        {entity.excerpt}
                    </div>
                </div>
                {actions}
            </div>
        )
    }
}

