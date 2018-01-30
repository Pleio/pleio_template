import React from "react"
import Accordeon from "../../../core/components/Accordeon"
import { showFullDate } from "../../../lib/showDate"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Events extends React.Component {
    render() {
        const { data } = this.props

        if (!data.events || data.events.edges.length === 0) {
            return (
                <div />
            )
        }

        const items = data.events.edges.map((entity) => (
            <Link key={entity.guid} to={entity.url} className="card__item">
                <div className="___colored">{showFullDate(entity.startDate)}</div>
                <span>{entity.title}</span>
            </Link>
        ))

        return (
            <Accordeon title="Agenda" className="card" last side>
                {items}
                <div className="card__bottom">
                    <Link to="/events" className="read-more">
                        <div className="read-more__circle" />
                        <span>Alles</span>
                    </Link>
                </div>
            </Accordeon>
        )
    }
}

const Query = gql`
    query   Events {
        events(offset: 0, limit: 5) {
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

export default graphql(Query, Settings)(Events)