import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"
import { stringToTags } from "../lib/helpers"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import InputField from "./components/InputField"

class EditModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: []
        })

        let values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    title: values.title,
                    description: values.description,
                    tags: stringToTags(values.tags)
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
                <Form ref="form" className="form" onSubmit={this.onSubmit}>
                    <InputField name="title" type="text" placeholder="Titel" className="form__input" value={this.props.entity.title} rules="required" autofocus />
                    <RichTextField name="description" placeholder="Beschrijving" value={this.props.entity.description} rules="required" />
                    <InputField name="tags" type="text" placeholder="Tags" className="form__input" value={this.props.entity.tags} />
                    <button className="button" type="submit">
                        Wijzigen
                    </button>
                </Form>
            </Modal>
        )
    }
}

const EDIT = gql`
    mutation editEntity($input: editEntityInput!) {
        editEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    title
                    description
                    accessId
                    tags
                }
            }
        }
    }
`
const withEdit = graphql(EDIT)

export default connect()(withEdit(EditModal))