import React from "react"

export default class Attendees extends React.Component {
    render() {
        const { entity } = this.props

        if (!entity.attendees || entity.attendees.total === 0) {
            return (
                <div className="people" />
            )
        }

        const attendees = entity.attendees.edges.map((attendee) => (
            <div className="face" style={{backgroundImage:`url(${attendee.icon})`}} />            
        ))

        return (
            <div className="people">
                {attendees}
                <div className="people__more">+6</div>
            </div>
        )
    }
}