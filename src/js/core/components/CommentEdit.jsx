import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentDelete from "./CommentDelete"
import { logErrors } from "../../lib/helpers"

class CommentEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            description: this.props.entity.description || "",
            errors: []
        }

        this.onChange = (e) => this.setState({description: e.target.value})

        this.onCancel = this.onCancel.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            this.setState({
                description: nextProps.entity.description
            })
        }
    }

    onCancel(e) {
        e.preventDefault()
        if (this.props.toggleEdit) {
            this.props.toggleEdit()
        }
    }

    onDelete(e) {
        e.preventDefault()
        this.refs.commentDelete.getWrappedInstance().toggle()
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: []
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    description: this.state.description
                }
            }
        }).then(({data}) => {
            if (this.props.toggleEdit) {
                this.props.toggleEdit()
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <form className="comment-edit" onSubmit={this.onSubmit}>
                <div title="Terug naar forum" className="comment-edit__close" onClick={this.onCancel}></div>
                <h3 className="comment-edit__title">Bewerk antwoord</h3>
                <div className="comment-edit__top">
                    <img src={this.props.entity.owner.icon} className="comment-edit__image" />
                    <div href={this.props.entity.owner.url} title="Bekijk profiel" className="comment-edit__name">
                        {this.props.entity.owner.name}
                    </div>
                </div>
                <textarea placeholder="Voeg antwoord toe..." className="comment-edit__content" onChange={this.onChange} value={this.state.description} />
                <div className="comment-edit__bottom buttons ___gutter">
                    <a className="button__underline" onClick={this.onDelete}>
                        Verwijder antwoord
                    </a>
                    <button className="button ___grey comment-edit__cancel" onClick={this.onCancel}>
                        Annuleer
                    </button>
                    <button type="submit" className="button ___primary">
                        Opslaan
                    </button>
                </div>
                <CommentDelete ref="commentDelete" entity={this.props.entity} />
            </form>
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
                }
            }
        }
    }
`
const withMutation = graphql(Mutation)
export default withMutation(CommentEdit)