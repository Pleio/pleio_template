import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"
import { getValueFromTags, getValuesFromTags } from "../lib/helpers"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import InputField from "./components/InputField"
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
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description)),
            featuredImage: values.featuredImage,
            tags: new Set().merge([values.category]).merge(values.sector).merge(values.tags).toJS()
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
            location.reload()
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
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
            <Modal id="edit" title={this.props.title} full={this.props.featuredImage ? true : false}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    {featuredImage}
                    <div className="container">
                        <div className="form">
                            <InputField name="title" type="text" placeholder="Titel" className="form__input" value={this.props.entity.title} rules="required" autofocus />
                            <RichTextField name="description" placeholder="Beschrijving" value={this.props.entity.description} richValue={this.props.entity.richDescription} rules="required" />
                            {extraFields}
                            <SelectField label="Categorie" name="category" className="form__input" options={categoryOptions} rules="required" value={getValueFromTags(this.props.entity.tags, Object.keys(categoryOptions))} />
                            <SwitchesField label="Onderwijssector" name="sector" className="form__input" options={sectorOptions} rules="required" value={getValuesFromTags(this.props.entity.tags, Object.keys(sectorOptions))} />
                            <TagsField name="tags" type="text" className="form__input" value={new Set(this.props.entity.tags).subtract(Object.keys(sectorOptions)).subtract(Object.keys(categoryOptions)).toJS()} />
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