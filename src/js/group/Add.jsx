import React from "react"
import ReactDOM from "react-dom"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../core/components/Errors"
import ActionContainer from "../core/components/ActionContainer"
import TextField from "../core/components/TextField"
import RichTextField from "../core/components/RichTextField"
import Form from "../core/components/Form"
import InputField from "../core/components/InputField"
import FeaturedField from "../core/components/FeaturedField"
import TagsField from "../core/components/TagsField"
import SelectField from "../core/components/SelectField"
import SwitchField from "../core/components/SwitchField"
import IconField from "../core/components/IconField"
import { groupPlugins as defaultPlugins } from "../lib/constants"
import { convertToRaw } from "draft-js"
import { Set } from "immutable"

class Add extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onClose = this.onClose.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onClose() {
        this.props.history.push("/groups")
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
            introduction: JSON.stringify(convertToRaw(values.introduction)),
            icon: values.icon,
            featured: values.featured,
            isClosed: (values.membership === "closed") ? true : false,
            tags: values.tags,
            plugins: Object.keys(defaultPlugins)
        }

        this.props.mutate({
            variables: {
                input
            }
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
            <ActionContainer title="Nieuwe groep" onClose={this.onClose}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    <FeaturedField name="featured" />
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                                {errors}
                                <div className="form">
                                    <InputField label="Naam" name="name" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                                    <IconField name="icon" />
                                    <SelectField label="Lidmaatschap" name="membership" type="text" className="form__input" options={{open: "Open", "closed": "Besloten"}} value="open" />
                                    <TextField label="Beschrijving" name="description" type="text" placeholder="Vertel wat over de groep" className="form__input" rules="required" />
                                    <RichTextField label="Introductie" name="introduction" type="text" placeholder="Hier kun je een korte introductie geven aan de leden van de groep" className="form__input" />
                                    <TagsField label="Steekwoorden (tags) toevoegen" name="tags" type="text" className="form__input" />
                                    <div className="buttons ___end ___margin-top">
                                        <button className="button" type="submit">
                                            Aanmaken
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </ActionContainer>
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