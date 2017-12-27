import React from "react"
import ReactDOM from "react-dom"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import DeleteModal from "./Delete"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import { getValueFromTags, getValuesFromTags } from "../lib/helpers"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import InputField from "./components/InputField"
import ContentFiltersInputField from "./components/ContentFiltersInputField"
import TagsField from "./components/TagsField"
import FeaturedField from "./components/FeaturedField"
import DateTimeField from "./components/DateTimeField"
import SwitchField from "./components/SwitchField"
import SwitchesField from "./components/SwitchesField"
import AccessField from "./components/AccessField"
import { sectorOptions, categoryOptions } from "../lib/filters"
import { convertToRaw } from "draft-js"
import { Set } from "immutable"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onScroll = this.onScroll.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
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
            featured: values.featured,
            accessId: values.accessId,
            writeAccessId: values.writeAccessId,
            tags: new Set().merge(values.filters).merge(values.tags).toJS()
        }

        switch (this.props.subtype) {
            case "news":
                input["source"] = values.source
                input["isFeatured"] = values.isFeatured
            case "blog":
                input["isRecommended"] = values.isRecommended
                break
            case "event":
                input["source"] = values.source
                input["location"] = values.location
                input["rsvp"] = values.rsvp
                input["startDate"] = values.start
                input["endDate"] = values.end
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            if (this.props.afterEdit) {
                this.props.afterEdit()
            }
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
        const { entity, viewer } = this.props

        if (!entity) {
            return (
                <div />
            )
        }

        let featured
        if (this.props.featured) {
            featured = (
                <FeaturedField name="featured" value={entity.featured} />
            )
        }

        let extraFields
        switch (this.props.subtype) {
            case "news":
                extraFields = (
                    <div>
                        <InputField name="source" type="text" placeholder="Bron" className="form__input" value={entity.source} />
                        <SwitchField name="isFeatured" type="text" className="form__input" value={entity.isFeatured} label="Dit bericht is uitgelicht" />
                    </div>
                )
                break
            case "blog":
                if (viewer && viewer.isAdmin) {
                    extraFields = (
                        <div>
                            <SwitchField name="isRecommended" type="text" className="form__input" value={entity.isRecommended} label="Deze blog is aanbevolen" />
                        </div>
                    )
                }
                break
            case "event":
                extraFields = (
                    <div>
                        <InputField name="source" type="text" placeholder="Externe link" className="form__input" value={entity.source} />
                        <InputField name="location" type="text" placeholder="Locatie" className="form__input" value={entity.location} />
                        <SwitchField name="rsvp" type="text" className="form__input" label="Aanwezigheid registeren" value={entity.rsvp} />
                        <DateTimeField name="start" className="form__input" label="Startdatum" value={entity.startDate} />
                        <DateTimeField name="end" className="form__input" label="Einddatum" value={entity.endDate} />
                    </div>
                )
                break
        }

        let permissions, write
        if (window.__SETTINGS__['advancedPermissions']) {
            if (this.props.subtype === "wiki") {
                write = (
                    <AccessField write name="writeAccessId" label="Schrijfrechten" value={entity.writeAccessId} />
                )
            }

            permissions = (
                <div>
                    <AccessField name="accessId" label="Leesrechten" value={entity.accessId} />
                    {write}
                </div>
            )
        }


        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                {featured}
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                            <div className="form">
                                <Errors errors={this.state.errors} />
                                <InputField name="title" type="text" placeholder="Titel" className="form__input" value={entity.title} rules="required" autofocus />
                                <RichTextField ref="richText" name="description" placeholder="Beschrijving" value={entity.description} richValue={entity.richDescription} rules="required" />
                                {extraFields}
                                {permissions}
                                <ContentFiltersInputField name="filters" className="form__input" value={entity.tags} />
                                <TagsField name="tags" type="text" className="form__input" value={entity.tags} />
                                <div className="buttons ___space-between">
                                    <button className="button" type="submit">
                                        Wijzigen
                                    </button>
                                    <button className="button ___link" onClick={this.props.onDeleteClick}>
                                        Verwijderen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

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
                    writeAccessId
                    source
                    isFeatured
                    isRecommended
                    featured {
                        image
                        video
                        positionY
                    }
                    startDate
                    endDate
                    tags
                }
            }
        }
    }
`

export default graphql(Mutation)(Edit)