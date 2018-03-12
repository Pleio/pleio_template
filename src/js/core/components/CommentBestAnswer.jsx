import React from "react"
import showDate from "../../lib/showDate"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"
import autobind from "autobind-decorator"

class CommentBestAnswer extends React.Component {
    @autobind
    toggleBestAnswer() {
        const { entity } = this.props

        if (!entity.canChooseBestAnswer) {
            return
        }

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

        if (!entity.canChooseBestAnswer) {
            if (entity.isBestAnswer) {
                return (
                    <button className="comment__best-answer ___is-chosen ___disabled" />
                )
            } else {
                return (
                    <div />
                )
            }
        }

        return (
            <button className={classnames({
                "comment__best-answer": true,
                "___is-chosen": entity.isBestAnswer
            })} title="Gekozen als beste antwoord" onClick={this.toggleBestAnswer} />
        )
    }
}


const Mutation = gql`
    mutation CommentBestAnswer($input: toggleBestAnswerInput!) {
        toggleBestAnswer(input: $input) {
            object {
                guid
                comments {
                    guid
                    isBestAnswer
                }
            }
        }
    }
`;

export default graphql(Mutation)(CommentBestAnswer)