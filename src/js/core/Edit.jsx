import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"
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
import SwitchField from "./components/SwitchField"

class EditModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onDelete = this.onDelete.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onDelete(e) {
        e.preventDefault()
        this.props.dispatch(showModal("delete"))
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: []
        })

        let values = this.refs.form.getValues()
        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid,
            title: values.title,
            description: values.description,
            featuredImage: values.featuredImage,
            tags: stringToTags(values.tags)
        }

        switch (this.props.subtype) {
            case "news":
                input["source"] = values.source
                input["isFeatured"] = values.isFeatured
        }

        this.props.mutate({
            variables: {
                input
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
        let featuredImage
        if (this.props.featuredImage) {
            featuredImage = (
                <FeaturedImageField name="featuredImage" value={this.props.entity.featuredImage} />
            )
        }

        let extraFields
        switch (this.props.subtype) {
            case "news":
                extraFields = (
                    <div>
                        <InputField name="source" type="text" placeholder="Bron" className="form__input" value={this.props.entity.source} />
                        <SwitchField name="isFeatured" type="text" className="form__input" value={this.props.entity.isFeatured} label="Dit bericht is uitgelicht" />
                    </div>
                )
        }

        return (
            <Modal id="edit" title={this.props.title} full={this.props.featuredImage ? true : false}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    {featuredImage}
                    <div className="form">
                        <InputField name="title" type="text" placeholder="Titel" className="form__input" value={this.props.entity.title} rules="required" autofocus />
                        <RichTextField name="description" placeholder="Beschrijving" value={this.props.entity.description} rules="required" />
                        <InputField name="tags" type="text" placeholder="Tags" className="form__input" value={this.props.entity.tags} />
                        {extraFields}
                        <div className="buttons ___space-between">
                            <button className="button" type="submit">
                                Wijzigen
                            </button>
                            <button className="button ___link" onClick={this.onDelete}>
                                Verwijderen
                            </button>
                        </div>
                    </div>
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
                    source
                    isFeatured
                    featuredImage
                    tags
                }
            }
        }
    }
`
const withEdit = graphql(EDIT)

export default connect()(withEdit(EditModal))