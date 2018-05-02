import React from "react"
import classNames from "classnames"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import { convertToRaw } from "draft-js"
import Form from "../../core/components/Form"
import RichTextField from "../../core/components/RichTextField"
import { logErrors } from "../../lib/helpers"

class AddCommentForm extends React.Component {
    @autobind
    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: null
        })

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    type: "object",
                    subtype: "comment",
                    description: values.description.getPlainText(),
                    richDescription: JSON.stringify(convertToRaw(values.description)),
                    containerGuid: this.props.object.guid
                }
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            if (this.props.onSuccess) {
                this.props.onSuccess()
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({ errors: errors })
        })
    }

    render() {
        let icon, name, url
        if (this.props.user) {
            ({icon, name, url} = this.props.user)
        }

        return (
            <Form ref="form" className="comment-add" onSubmit={this.onSubmit}>
                <h3 className="comment-add__title">Reageer</h3>
                <div title="Terug naar forum" className="comment-add__close ___is-active" onClick={this.props.toggle}></div>
                <div className="comment-add__top">
                    <img src={icon} className="comment-add__image" />
                    <div href={url} title="Bekijk profiel" className="comment-add__name">{name}</div>
                </div>
                <RichTextField name="description" placeholder="Voeg een reactie toe..." className="comment-add__content" />
                <div className="comment-add__bottom form__actions">
                    <button type="submit" className="button button--primary">Reageer</button>
                </div>
            </Form>
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