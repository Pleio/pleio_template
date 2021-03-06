import React from "react"
import Modal from "../core/components/Modal"
import ActionContainer from "../core/components/ActionContainer"
import Form from "../core/components/Form"
import InputField from "../core/components/InputField"
import RadioField from "../core/components/RadioField"
import RichTextField from "../core/components/RichTextField"
import AccessField from "../core/components/AccessField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../lib/helpers"
import Errors from "../core/components/Errors"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"

class Add extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: [],
            pageType: "campagne"
        }
    }

    @autobind
    onClose() {
        this.props.history.push("/cms")
    }

    afterAdd() {
        window.location.href = "/cms"
    }

    @autobind
    onSubmit(e) {
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            title: values.title,
            pageType: values.pageType,
            accessId: values.accessId
        }

        if (values.description) {
            input['description'] = values.description.getPlainText()
            input['richDescription'] = JSON.stringify(convertToRaw(values.description))
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            window.location.href = "/cms"
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

        let permissions
        if (window.__SETTINGS__['advancedPermissions']) {
            permissions = (
                <AccessField name="accessId" label="Leesrechten" />
            )
        }

        return (
            <ActionContainer title="Pagina toevoegen" onClose={this.onClose}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                                {errors}
                                <div className="form">
                                    <InputField label="Titel" name="title" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                                    <RadioField label="Soort" name="pageType" options={[{name:"Campagne", value:"campagne"}, {name:"Tekst", value: "text"}]} className="form__input" value="campagne" onChange={this.onChangeType} />
                                    <RichTextField ref="richText" name="description" placeholder="Beschrijving" rules="required" />
                                    {permissions}
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
mutation AddPage($input: addPageInput!) {
    addPage(input: $input) {
        entity {
            guid
        }
    }
}
`

export default graphql(Mutation)(Add)