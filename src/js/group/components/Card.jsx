import React from "react"
import { Link } from "react-router"
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

        return (
            <div className="col-lg-6">
                <Link to={entity.url} className={classnames({"card-group": true})}>
                        <div style={{backgroundImage: `url('${entity.icon}')`}} className="card-group__picture" />
                        <div className="card-group__title">
                            {entity.name}
                        </div>
                        <div className="card-group__bottom">
                            <div className="card-group__members">{entity.members.total}{(entity.members.total === 1) ? " lid" : " leden"}</div>
                            {closed}
                        </div>
                </Link>
            </div>
        )
    }
}