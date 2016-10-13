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
import Joi from "joi-browser"

class AddModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null,
            tags: []
        }

        this.onChangeTags = (e) => this.setState({tags: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: null
        })

        let values = this.refs.form.getValues()
        console.log(values)

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    type: "object",
                    subtype: "news",
                    title: values.title,
                    description: values.description,
                    tags: stringToTags(values.tags)
                }
            },
            refetchQueries: ["InfiniteList"]
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
            <Modal id="add" title={this.props.title}>
                <Form ref="form" className="form" onSubmit={this.onSubmit}>
                    <InputField name="title" type="text" placeholder="Titel" className="form__input" validate={Joi.string().required()} />
                    <RichTextField name="description" ref="description" placeholder="Beschrijving" validate={Joi.string().required()} />
                    <InputField name="tags" ref="tags" type="text" placeholder="Tags" className="form__input" />
                    <button className="button" type="submit">
                        Toevoegen
                    </button>
                </Form>
            </Modal>
        )
    }
}

const ADD = gql`
    mutation addEntity($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
            }
        }
    }
`
const withAdd = graphql(ADD)
export default connect()(withAdd(AddModal))