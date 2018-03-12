import React from "react"
import showDate from "../../lib/showDate"
import { graphql } from "react-apollo"
import { withRouter } from "react-router-dom"
import gql from "graphql-tag"
import autobind from "autobind-decorator"

class CommentVote extends React.Component {
    @autobind
    submitVote(score) {
        const { history, location } = this.props

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    score
                }
            }
        }).catch((error) => {
            if (error.graphQLErrors[0].message === "not_logged_in") {
                history.push({pathname: "/login", state: { fromComment: true, next: location.pathname }})
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

export default graphql(Query)(withRouter(CommentVote))