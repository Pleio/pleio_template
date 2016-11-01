import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Likes extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLiked: this.props.entity.hasVoted || false,
            likes: this.props.entity.votes
        }

        this.onToggle = this.onToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            this.setState({
                isLiked: nextProps.entity.hasVoted || false,
                likes: nextProps.entity.votes
            })
        }
    }

    onToggle(e) {
        e.preventDefault()

        let isAdding = !this.state.isLiked

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: this.props.entity.guid,
                    score: isAdding ? 1 : 0
                }
            }
        })

        this.setState({
            isLiked: isAdding
        })
    }

    render() {
        return (
            <div className={classnames({"button__text ___likes": true, "___margin-top": this.props.marginTop, "___is-liked": this.state.isLiked})} onClick={this.onToggle}>
                <span>{this.state.likes}</span>&nbsp;{this.state.likes == 1 ? "like" : "likes"}
            </div>
        )
    }
}

const Query = gql`
    mutation Likes($input: voteInput!) {
        vote(input: $input) {
            object {
                guid
                hasVoted
                votes
            }
        }
    }
`
const withQuery = graphql(Query)
export default withQuery(Likes)