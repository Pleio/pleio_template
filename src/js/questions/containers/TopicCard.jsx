import React from "react"
import Accordeon from "../../core/components/Accordeon"
import { Link } from "react-router"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { showShortDate } from "../../lib/showDate"

class TopicCard extends React.Component {
    render() {
        const { entities } = this.props.data

        if (!entities) {
            return (
                <div></div>
            )
        }

        const items = entities.edges.map((entity, i) => (
            <Link key={i} to={entity.url} className="card-list-topics__item">
                <div className="card-list-topics__date">
                    {showShortDate(entity.timeCreated)}
                </div>
                <div className="card-list-topics__post">
                    {entity.title}
                </div>
                <div className="card-list-topics__comments">
                    {entity.commentCount}
                </div>
            </Link>
        ))

        return (
            <div className="col-lg-6">
                <Accordeon title={this.props.title} className="card-list-topics">
                    {items}
                    <div className="card-list-topics__more">
                        <Link to={`/questions/all`} className="read-more">
                            <div className="read-more__circle"></div>
                            <span>Alles</span>
                        </Link>
                    </div>
                </Accordeon>
            </div>
        )
    }
}

const Query = gql`
    query QuestionTopicCard($tags: [String!]) {
        entities(subtype:"question", offset: 0, limit: 5, tags: $tags) {
            edges {
                guid
                ... on Object {
                    title
                    timeCreated
                    commentCount
                    url
                }
            }
        }
    }
`;

export default graphql(Query)(TopicCard);