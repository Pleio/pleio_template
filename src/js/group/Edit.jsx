import React from "react"
import ReactDOM from "react-dom"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../core/components/Errors"
import ActionContainer from "../core/components/ActionContainer"
import AccessSelect from "../core/containers/AccessSelect"
import TextField from "../core/components/TextField"
import RichTextField from "../core/components/RichTextField"
import Form from "../core/components/Form"
import FeaturedField from "../core/components/FeaturedField"
import InputField from "../core/components/InputField"
import TagsField from "../core/components/TagsField"
import SelectField from "../core/components/SelectField"
import SwitchesField from "../core/components/SwitchesField"
import IconField from "../core/components/IconField"
import { convertToRaw } from "draft-js"
import { Link } from "react-router-dom"
import NotFound from "../core/NotFound"
import DeleteModal from "../core/Delete"
import { groupPlugins as defaultPlugins } from "../lib/constants"
import { Set } from "immutable"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onClose = this.onClose.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    afterDelete() {
        window.location.href = '/groups'
    }

    onClose() {
        const { entity } = this.props.data
        this.props.history.push(entity.url)
    }

    onDelete(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    onSubmit(e) {
        const { entity } = this.props.data

        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            guid: entity.guid,
            name: values.name,
            description: values.description,
            introduction: JSON.stringify(convertToRaw(values.introduction)),
            isClosed: (values.membership === "closed") ? true : false,
            icon: values.icon,
            featured: values.featured,
            tags: values.tags,
            plugins: values.plugins
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            window.location.href = entity.url
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        const rootUrl =  `/groups/edit/${entity.guid}`

        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        const selectedPlugins = entity.plugins.length > 0 ? entity.plugins : Object.keys(defaultPlugins)

        let membership = (entity.isClosed) ? "closed" : "open"

        return (
            <ActionContainer title="Bewerk groep" onClose={this.onClose}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    <FeaturedField name="featured" value={entity.featured} />
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                                {errors}
                                        <div className="form">
                                            <InputField value={entity.name} label="Naam" name="name" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                                            <IconField name="icon" value={entity.icon} />
                                            <SelectField label="Lidmaatschap" name="membership" type="text" className="form__input" options={{open: "Open", "closed": "Besloten"}} value={membership} />
                                            <TextField label="Beschrijving" name="description" type="text" placeholder="Vertel wat over de groep voor leden die nog geen lid zijn" className="form__input" rules="required" value={entity.description} />
                                            <RichTextField label="Introductie" name="introduction" type="text" placeholder="Hier kun je een korte introductie geven aan de leden van de groep" className="form__input" richValue={entity.introduction} />
                                            <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" value={entity.tags}/>
                                            <SwitchesField label="Plugins" name="plugins" options={defaultPlugins} values={selectedPlugins} />

                                            <div className="buttons ___space-between">
                                                <button className="button" type="submit" name="update">
                                                    Bijwerken
                                                </button>
                                                <button className="button ___link" onClick={this.onDelete}>
                                                    Verwijderen
                                                </button>
                                            </div>
                                        </div>
                            </div>
                        </div>
                    </div>
                </Form>
                <DeleteModal ref="deleteModal" title="Groep verwijderen" entity={entity} subtype="group" afterDelete={this.afterDelete} />
            </ActionContainer>
        )
    }
}

const Query = gql`
    query getGroupInfo($guid: String!) {
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                name
                description
                introduction
                icon
                featured {
                    video
                    image
                    positionY
                }
                isClosed
                plugins
                canEdit
                url
                tags
            }
        }
    }
`

const Mutation = gql`
    mutation editGroup($input: editGroupInput!) {
        editGroup(input: $input) {
            group {
                guid
                name
                description
                introduction
                plugins
                icon
                isClosed
                tags
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Mutation)(graphql(Query, Settings)(Edit))