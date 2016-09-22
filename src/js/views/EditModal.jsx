import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../components/Errors"
import Modal from "../components/Modal"
import RichText from "../components/RichText"
import AccessSelect from "../containers/AccessSelect"
import { stringToTags } from "../lib/helpers"

class EditModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null,
            title: "",
            description: "",
            tags: []
        }

        this.onChangeTitle = (e) => this.setState({title: e.target.value})
        this.onChangeDescription = (e) => this.setState({description: e.target.value})
        this.onChangeTags = (e) => this.setState({tags: e.target.value})

        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.object) {
            this.setState({
                title: nextProps.object.title,
                description: nextProps.object.description,
                accessId: nextProps.object.accessId,
                tags: nextProps.object.tags
            })
        }
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
                    guid: this.props.object.guid,
                    title: this.state.title,
                    description: this.state.description,
                    tags: stringToTags(this.state.tags)
                }
            }
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal id="edit" title={this.props.title}>
                <form className="form" onSubmit={this.onSubmit}>
                    <label className="form__item">
                        <input type="text" placeholder="Titel" className="form__input" onChange={this.onChangeTitle} value={this.state.title} />
                    </label>
                    <label className="form__item">
                        <textarea placeholder="Beschrijving" onChange={this.onChangeDescription} value={this.state.description} />
                    </label>
                    <label className="form__item">
                        <input type="text" placeholder="Tags" className="form__input" onChange={this.onChangeTags} value={this.state.tags} />
                    </label>

                    <button className="button">Wijzigen</button>
                </form>
            </Modal>
        )
    }
}

const EDIT = gql`
    mutation editEntity($input: editEntityInput!) {
        editEntity(input: $input) {
            entity {
                ...editObject
            }
        }
    }

    fragment editObject on Object {
        guid
        title
        description
        accessId
        tags
    }
`
const withEdit = graphql(EDIT)

export default connect()(withEdit(EditModal))