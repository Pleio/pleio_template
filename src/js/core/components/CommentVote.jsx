import React from "react"
import showDate from "../../lib/showDate"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class CommentVote extends React.Component {
    constructor(props) {
        super(props)
        this.submitVote = this.submitVote.bind(this)
    }

    submitVote(score) {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    score
                }
            }
        })
    }

    render() {
        const { entity } = this.props

        return (
            <div className="comment__vote">
                <div className="comment__vote-up" onClick={() => this.submitVote(1)}>
                    Stem antwoord omhoog
                </div>
                <div className="comment__points">{entity.votes}</div>
                <div className="comment__vote-down" onClick={() => this.submitVote(-1)}>
                    Stem antwoord omlaag
                </div>
            </div>
        )
    }
}


const Query = gql`
    mutation submitVote($input: voteInput!) {
        vote(input: $input) {
            object {
                guid
                votes
            }
        }
    }
`;

const withQuery = graphql(Query)
export default withQuery(CommentVote)