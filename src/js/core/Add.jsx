import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"
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

class AddModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onScroll = this.onScroll.bind(this)
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
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description)),
            featuredImage: values.featuredImage,
            tags: new Set().merge([values.category]).merge(values.sector).merge(values.tags).toJS()
        }

        switch (this.props.subtype) {
            case "news":
                input["source"] = values.source
                input["isFeatured"] = values.isFeatured
                break
            case "blog":
                input["isRecommended"] = values.isRecommended
                break
        }

        this.props.mutate({
            variables: {
                input
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            this.props.dispatch(hideModal())
            location.reload()
        }).catch((errors) => {
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
                <FeaturedImageField name="featuredImage" />
            )
        }

        let extraFields
        switch (this.props.subtype) {
            case "news":
                extraFields = (
                    <div>
                        <InputField name="source" type="text" placeholder="Bron" className="form__input" />
                        <SwitchField name="isFeatured" type="text" className="form__input" label="Dit bericht is uitgelicht" />
                    </div>
                )
                break
            case "blog":
                if (viewer && viewer.isAdmin) {
                    extraFields = (
                        <div>
                            <SwitchField name="isRecommended" type="text" className="form__input" label="Deze blog is aanbevolen" />
                        </div>
                    )
                }
                break
        }

        return (
            <Modal id="add" title={this.props.title} full={this.props.featuredImage ? true : false} onScroll={this.onScroll}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    {featuredImage}
                    <div className="container">
                        <div className="form">
                            <InputField name="title" type="text" placeholder="Titel" className="form__input" rules="required" autofocus />
                            <RichTextField ref="richText" name="description" placeholder="Beschrijving" rules="required" />
                            {extraFields}
                            <SelectField label="Categorie" name="category" className="form__input" options={categoryOptions} rules="required" />
                            <SwitchesField label="Onderwijssector" name="sector" className="form__input" options={sectorOptions} rules="required" />
                            <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" />
                            <div className="buttons ___end ___margin-top">
                                <button className="button" type="submit">
                                    Publiceer
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
    mutation addEntity($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
            }
        }
    }
`
const withQuery = graphql(Query)
const withMutation = graphql(Mutation)

export default connect()(withMutation(withQuery(AddModal)))