import React from "react"
import { Link } from "react-router-dom"
import showDate from "../../lib/showDate"
import classnames from "classnames"

export default class Card extends React.Component {
    render () {
        const { entity } = this.props

        let closed
        if (entity.isClosed) {
            closed = (
                <div className="card-group__secret">
                    Besloten
                </div>
            )
        }

        let url
        if (!entity.isClosed) {
            url = entity.url
        } else if (entity.isClosed && (entity.membership === "joined" || entity.canEdit)) {
            url = entity.url
        } else {
            url = `/groups/info/${entity.guid}`
        }

        return (
            <div className="col-lg-6">
                <Link to={url} className={classnames({"card-group": true})}>
                        <div style={{backgroundImage: `url('${entity.icon}')`}} className="card-group__picture" />
                        <div className="card-group__title">
                            {entity.name}
                        </div>
                        <p>{entity.excerpt}</p>
                        <div className="flexer ___space-between">
                            <div className="card-group__members">{entity.members.total}{(entity.members.total === 1) ? " lid" : " leden"}</div>
                            {closed}
                        </div>
                </Link>
            </div>
        )
    }
}