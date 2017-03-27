import React from "react"
import ReactDOM from "react-dom"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../core/components/Errors"
import Modal from "../core/components/Modal"
import AccessSelect from "../core/containers/AccessSelect"
import TextField from "../core/components/TextField"
import Form from "../core/components/Form"
import InputField from "../core/components/InputField"
import TagsField from "../core/components/TagsField"
import SelectField from "../core/components/SelectField"
import SwitchField from "../core/components/SwitchField"
import IconField from "../core/components/IconField"
import { convertToRaw } from "draft-js"
import { Link } from "react-router"
import NotFound from "../core/NotFound"
import DeleteModal from "../core/Delete"
import { Set } from "immutable"

class Edit extends React.Component {
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
        this.refs.deleteModal.toggle()
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()
        let input = {
            clientMutationId: 1,
            guid: this.props.data.entity.guid,
            name: values.name,
            description: values.description,
            isClosed: (values.membership === "closed") ? true : false,
            tags: values.tags
        }

        this.props.mutate({
            variables: {
                input
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            window.location.href = "/groups"
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
            console.log(errors)
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

        let membership = (entity.isClosed) ? "closed" : "open"
        return (
            <Modal id="add" title="Bewerk groep" full={true} noParent={true}>
                {errors}
                <Form ref="form" onSubmit={this.onSubmit}>
                    <div className="container">
                        <div className="form">
                            <InputField value={entity.name} label="Naam" name="name" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                            <IconField />                            
                            <SelectField label="Lidmaatschap" name="membership" type="text" className="form__input" options={{open: "Open", "closed": "Besloten"}} value={membership} />
                            <TextField label="Beschrijving" name="description" type="text" placeholder="Vertel wat over de groep" className="form__input" rules="required" value={entity.description} />
                            <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" value={entity.tags}/>

                            <div className="buttons ___end ___margin-top">
                                <button className="button" type="submit" name="update">
                                    Bijwerken
                                </button>
                                <button className="button ___link" onClick={this.onDelete}>
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
                <DeleteModal ref="deleteModal" title="Groep verwijderen" entity={entity} subtype="group" refetchQueries={["GroupsList"]} />
            </Modal>
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
                icon
                isClosed
                canEdit
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
                guid: ownProps.params.guid
            }
        }
    }
}

export default graphql(Mutation)(graphql(Query, Settings)(Edit))