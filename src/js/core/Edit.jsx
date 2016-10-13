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
import { convertToRaw } from "draft-js"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import InputField from "./components/InputField"
import Joi from "joi-browser"

class EditModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, {errors: []}, this.props.entity)

        this.onChangeTitle = (e) => this.setState({title: e.target.value})
        this.onChangeDescription = (description) => this.setState({description})
        this.onChangeTags = (e) => this.setState({tags: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity) {
            this.setState(nextProps.entity)
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
                    guid: this.state.guid,
                    title: this.state.title,
                    description: JSON.stringify(convertToRaw(this.state.description.getCurrentContent())),
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
                <Form className="form" onSubmit={this.onSubmit}>
                    <InputField type="text" placeholder="Titel" className="form__input" onChange={this.onChangeTitle} value={this.state.title} validate={Joi.string().required()} />
                    <RichTextField placeholder="Beschrijving" onChange={this.onChangeDescription} value={this.state.description} validate={Joi.string().required()} />
                    <InputField type="text" placeholder="Tags" className="form__input" onChange={this.onChangeTags} value={this.state.tags} />
                    <button className="button" type="submit">Wijzigen</button>
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