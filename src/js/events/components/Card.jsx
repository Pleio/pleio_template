import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import { showFullDate } from "../../lib/showDate"
import classnames from "classnames"
import Select from "../../core/components/NewSelect"
import People from "./People"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        let style
        if (entity.featured.image) {
            style = { backgroundImage: `url(${entity.featured.image}`}
        } else {
            style = { backgroundColor: "#8fcae7" }
        }

        return (
            <div className="card-event">
                <Link to={entity.url} className="card-event__picture" title={entity.title} style={style} />
                <div className="card-event__content">
                    <div className="date">{showFullDate(entity.startDate)}</div>
                    <Link to={entity.url} className="title">{entity.title}</Link>
                    <div className="card-event__bottom">
                        <Link to={entity.url}>
                            <People users={entity.attendees} />
                        </Link>
                    </div>
                </div>

            </div>
        )
    }
}