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
import { browserHistory } from "react-router"
import { convertToRaw } from "draft-js"
import { Set } from "immutable"

class Add extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onClose() {
        browserHistory.push("/groups")
    }

    onSubmit(e) {
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            name: values.name,
            description: values.description,
            icon: values.icon,
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
        })
    }

    render() {
        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <Modal id="add" title="Nieuwe groep" full={true} noParent={true} onClose={this.onClose}>
                {errors}
                <Form ref="form" onSubmit={this.onSubmit}>
                    <div className="container">
                        <div className="form">
                            <InputField label="Naam" name="name" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                            <IconField name="icon" />
                            <SelectField label="Lidmaatschap" name="membership" type="text" className="form__input" options={{open: "Open", "closed": "Besloten"}} value="open" />
                            <TextField label="Beschrijving" name="description" type="text" placeholder="Vertel wat over de groep" className="form__input" rules="required" />
                            <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" />
                            <div className="buttons ___end ___margin-top">
                                <button className="button" type="submit">
                                    Aanmaken
                                </button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const Mutation = gql`
    mutation addGroup($input: addGroupInput!) {
        addGroup(input: $input) {
            group {
                guid
            }
        }
    }
`

export default graphql(Mutation)(Add)