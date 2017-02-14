import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"
import { getValueFromTags, getValuesFromTags } from "../lib/helpers"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import InputField from "./components/InputField"
import ContentFiltersInputField from "./components/ContentFiltersInputField"
import TagsField from "./components/TagsField"
import FeaturedImageField from "./components/FeaturedImageField"
import SwitchField from "./components/SwitchField"
import SwitchesField from "./components/SwitchesField"
import SelectField from "./components/SelectField"
import { sectorOptions, categoryOptions } from "../lib/filters"
import { convertToRaw } from "draft-js"
import { Set } from "immutable"

class EditModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onScroll = this.onScroll.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onDelete(e) {
        this.props.dispatch(showModal("delete"))
    }

    onSubmit(e) {
        this.setState({
            errors: []
        })

        let values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid,
            title: values.title,
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description)),
            featuredImage: values.featuredImage,
            tags: new Set().merge(values.filters).merge(values.tags).toJS()
        }

        switch (this.props.subtype) {
            case "news":
                input["source"] = values.source
                input["isFeatured"] = values.isFeatured
            case "blog":
                input["isRecommended"] = values.isRecommended
                break
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    onScroll(e) {
        if (this.refs.richText) {
            this.refs.richText.onScroll(e)
        }
    }

    render() {
        let { viewer } = this.props.data

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
                break
            case "blog":
                if (viewer && viewer.isAdmin) {
                    extraFields = (
                        <div>
                            <SwitchField name="isRecommended" type="text" className="form__input" value={this.props.entity.isRecommended} label="Deze blog is aanbevolen" />
                        </div>
                    )
                }
                break
        }

        return (
            <Modal id="edit" title={this.props.title} full={this.props.featuredImage ? true : false} onScroll={this.onScroll}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    {featuredImage}
                    <div className="container">
                        <div className="form">
                            <InputField name="title" type="text" placeholder="Titel" className="form__input" value={this.props.entity.title} rules="required" autofocus />
                            <RichTextField ref="richText" name="description" placeholder="Beschrijving" value={this.props.entity.description} richValue={this.props.entity.richDescription} rules="required" />
                            {extraFields}
                            <ContentFiltersInputField name="filters" className="form__input" value={this.props.entity.tags} />
                            <TagsField name="tags" type="text" className="form__input" value={this.props.entity.tags} />
                            <div className="buttons ___space-between">
                                <button className="button" type="submit">
                                    Wijzigen
                                </button>
                                <button className="button ___link" onClick={this.onDelete}>
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const Query = gql`
    query addEntity {
        viewer {
            guid
            isAdmin
        }
    }
`

const Mutation = gql`
    mutation editEntity($input: editEntityInput!) {
        editEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    title
                    description
                    richDescription
                    url
                    accessId
                    source
                    isFeatured
                    isRecommended
                    featuredImage
                    tags
                }
            }
        }
    }
`

const withQuery = graphql(Query)
const withMutation = graphql(Mutation)

export default connect()(withMutation(withQuery(EditModal)))