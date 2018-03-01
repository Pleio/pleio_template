import React from "react"
import showDate from "../../lib/showDate"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"
import autobind from "autobind-decorator"

class CommentBestAnswer extends React.Component {
    @autobind
    toggleBestAnswer() {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid
                }
            }
        })
    }

    render() {
        const { entity } = this.props

        if (entity.isBestAnswer) {
            return (
                <button className="comment__best-answer ___is-chosen" title="Gekozen als beste antwoord" onClick={this.toggleBestAnswer} />
            )
        } else {
            return (
                <button className="comment__best-answer" title="Kies als beste antwoord" onClick={this.toggleBestAnswer} />
            )
        }
    }
}


const Mutation = gql`
    mutation CommentBestAnswer($input: toggleBestAnswerInput!) {
        toggleBestAnswer(input: $input) {
            object {
                guid
                isBestAnswer
            }
        }
    }
`;

export default graphql(Mutation)(CommentBestAnswer)