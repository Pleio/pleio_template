import React from "react"
import ReactDOM from "react-dom"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import RichTextField from "./components/RichTextField"
import Form from "./components/Form"
import ContentFiltersInputField from "./components/ContentFiltersInputField"
import InputField from "./components/InputField"
import TagsField from "./components/TagsField"
import DateTimeField from "./components/DateTimeField"
import FeaturedField from "./components/FeaturedField"
import SwitchField from "./components/SwitchField"
import AccessField from "./components/AccessField"
import { convertToRaw } from "draft-js"
import { Set } from "immutable"

class Add extends React.Component {
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

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            type: "object",
            subtype: this.props.subtype,
            title: values.title,
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description)),
            featured: values.featured,
            containerGuid: this.props.containerGuid,
            accessId: values.accessId,
            writeAccessId: values.writeAccessId,
            tags: new Set().merge(values.filters).merge(values.tags).toJS()
        }

        switch (this.props.subtype) {
            case "news":
                input["source"] = values.source
                input["isFeatured"] = values.isFeatured
                break
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
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            if (this.props.afterAdd) {
                this.props.afterAdd()
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
        let { viewer } = this.props.data

        let featured
        if (this.props.featured) {
            featured = (
                <FeaturedField name="featured" />
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
            case "event":
                extraFields = (
                    <div>
                        <InputField name="source" type="text" placeholder="Externe link" className="form__input" />
                        <InputField name="location" type="text" placeholder="Locatie" className="form__input" />
                        <SwitchField name="rsvp" type="text" className="form__input" label="Aanwezigheid registeren" value={true} />
                        <DateTimeField name="start" className="form__input" label="Startdatum" />
                        <DateTimeField name="end" className="form__input" label="Einddatum" />
                    </div>
                )
                break
        }

        let permissions, write
        if (window.__SETTINGS__['advancedPermissions']) {
            if (this.props.subtype === "wiki") {
                write = (
                    <AccessField write name="writeAccessId" label="Schrijfrechten" />
                )
            }

            permissions = (
                <div>
                    <AccessField name="accessId" label="Leesrechten" />
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
                                <InputField name="title" type="text" placeholder="Titel" className="form__input" rules="required" autofocus />
                                <RichTextField ref="richText" name="description" placeholder="Beschrijving" rules="required" />
                                {extraFields}
                                {permissions}
                                <ContentFiltersInputField name="filters" className="form__input" />
                                <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" />
                                <div className="buttons ___end ___margin-top">
                                    <button className="button" type="submit">
                                        Publiceer
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

export default graphql(Mutation)(graphql(Query)(Add))