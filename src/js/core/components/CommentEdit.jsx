import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import CommentDelete from "./CommentDelete"
import { logErrors } from "../../lib/helpers"
import { convertToRaw } from "draft-js"
import Form from "../../core/components/Form"
import RichTextField from "../../core/components/RichTextField"

class CommentEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onCancel(e) {
        e.preventDefault()
        if (this.props.toggleEdit) {
            this.props.toggleEdit()
        }
    }

    @autobind
    onDelete(e) {
        e.preventDefault()
        this.refs.commentDelete.getWrappedInstance().toggle()
    }

    @autobind
    onSubmit(e) {
        e.preventDefault()

        const { entity } = this.props

        const values = this.refs.form.getValues()

        this.setState({
            errors: []
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid,
                    description: values.description.getPlainText(),
                    richDescription: JSON.stringify(convertToRaw(values.description))
                }
            }
        }).then(({data}) => {
            if (this.props.toggleEdit) {
                this.props.toggleEdit()
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({ errors: errors })
        })
    }

    render() {
        const { entity } = this.props

        return (
            <Form ref="form" className="comment-edit" onSubmit={this.onSubmit}>
                <div title="Terug naar forum" className="comment-edit__close" onClick={this.onCancel}></div>
                <h3 className="comment-edit__title">Bewerk reactie</h3>
                <div className="comment-edit__top">
                    <img src={entity.owner.icon} className="comment-edit__image" />
                    <div href={entity.owner.url} title="Bekijk profiel" className="comment-edit__name">
                        {entity.owner.name}
                    </div>
                </div>
                <RichTextField name="description" placeholder="Voeg een reactie toe..." className="comment-add__content" value={entity.description} richValue={entity.richDescription} />
                <div className="comment-edit__bottom buttons ___gutter">
                    <a className="button__underline" onClick={this.onDelete}>
                        Verwijder reactie
                    </a>
                    <button className="button ___grey comment-edit__cancel" onClick={this.onCancel}>
                        Annuleer
                    </button>
                    <button type="submit" className="button ___primary">
                        Opslaan
                    </button>
                </div>
                <CommentDelete ref="commentDelete" entity={entity} />
            </Form>
        )
    }
}

const Mutation = gql`
    mutation editEntity($input: editEntityInput!) {
        editEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    description
                    richDescription
                }
            }
        }
    }
`
const withMutation = graphql(Mutation)
export default withMutation(CommentEdit)