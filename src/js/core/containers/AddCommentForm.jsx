import React from "react"
import classNames from "classnames"
import { graphql } from "react-apollo"
import { logErrors } from "../../lib/helpers"
import gql from "graphql-tag"

class AddCommentForm extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeDescription  = (e) => this.setState({description: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {description: ""}
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: null
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    type: "object",
                    subtype: "comment",
                    description: this.state.description,
                    containerGuid: this.props.object.guid
                }
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            if (this.props.onSuccess) {
                this.props.onSuccess()
            }

            this.setState({description: ""})
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let icon, name, url
        if (this.props.user) {
            ({icon, name, url} = this.props.user)
        }

        return (
            <form className="comment-add" onSubmit={this.onSubmit}>
                <h3 className="comment-add__title">Geef antwoord</h3>
                <div title="Terug naar forum" className="comment-add__close ___is-active"></div>
                <div className="comment-add__top">
                    <img src={icon} className="comment-add__image" />
                    <div href={url} title="Bekijk profiel" className="comment-add__name">{name}</div>
                </div>
                <textarea id="data-forum-answer-textarea" placeholder="Voeg antwoord toe..." className="comment-add__content" onChange={this.onChangeDescription} value={this.state.description} />
                <div className="comment-add__bottom form__actions">
                    <button type="submit" className="button button--primary">Antwoord</button>
                </div>
            </form>
        )
    }
}

const AddComment = gql`
    mutation AddComment($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    isFollowing
                }
            }
        }
    }
`
const withQuery = graphql(AddComment)
export default withQuery(AddCommentForm)