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
import FeaturedImageField from "./components/FeaturedImageField"

class AddModal extends React.Component {
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

        let input = {
            clientMutationId: 1,
            type: "object",
            subtype: this.props.subtype,
            title: values.title,
            description: values.description,
            featuredImage: values.featuredImage,
            tags: stringToTags(values.tags)
        }

        this.props.mutate({
            variables: {
                input
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
        let featuredImage
        if (this.props.featuredImage) {
            featuredImage = (
                <FeaturedImageField name="featuredImage" />
            )
        }

        return (
            <Modal id="add" title={this.props.title} full={this.props.featuredImage ? true : false}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    {featuredImage}
                    <div className="form">
                        <InputField name="title" type="text" placeholder="Titel" className="form__input" rules="required" autofocus />
                        <RichTextField name="description" placeholder="Beschrijving" rules="required" />
                        <InputField name="tags" ref="tags" type="text" placeholder="Tags" className="form__input" />
                        <button className="button" type="submit">
                            Toevoegen
                        </button>
                    </div>
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