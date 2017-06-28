import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import showDate from "../../lib/showDate"
import classnames from "classnames"
import Select from "../../core/components/NewSelect"
import Attendees from "./Attendees"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <div className="card-event">
                <Link to={entity.url} className="card-event__picture" title={entity.title} style={{backgroundColor:"#8fcae7"}} />
                <div className="card-event__content">
                    <div className="date">{showDate(entity.startDate)}</div>
                    <Link to={entity.url} className="title">{entity.title}</Link>
                    <div className="card-event__bottom">
                        <Select name="selector" options={{test: "Test", test2: "Test 2"}}/>
                        <Attendees entity={entity} />
                    </div>
                </div>

            </div>
        )
    }
}