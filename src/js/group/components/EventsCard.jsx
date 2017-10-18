import React from "react"
import Accordeon from "../../core/components/Accordeon"
import { showFullDate } from "../../lib/showDate"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class EventsCard extends React.Component {
    render() {
        const { data } = this.props

        if (!data.entities || data.entities.edges.length === 0) {
            return (
                <div />
            )
        }

        const items = data.entities.edges.map((entity) => (
            <Link key={entity.guid} to={entity.url} className="card__item">
                <div className="___colored">{showFullDate(entity.startDate)}</div>
                <span>{entity.title}</span>
            </Link>
        ))

        return (
            <Accordeon title="Agenda" className="card" last side>
                {items}
                <div className="card__bottom">
                    <Link to={this.props.entity.url} className="read-more" />
                </div>
            </Accordeon>
        )
    }
}

const Query = gql`
    query EventsCard($containerGuid: Int!) {
        entities(containerGuid: $containerGuid, subtype: "event", offset: 0, limit: 5) {
            edges {
                ... on Object {
                    guid
                    title
                    startDate
                    url
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                containerGuid: ownProps.entity.guid
            }
        }
    }
}

export default graphql(Query, Settings)(EventsCard)