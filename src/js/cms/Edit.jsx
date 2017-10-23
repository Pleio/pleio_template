import React from "react"
import AddCore from "../core/Add"
import Modal from "../core/components/Modal"
import NotFound from "../core/NotFound"
import ActionContainer from "../core/components/ActionContainer"
import Form from "../core/components/Form"
import DeleteCore from "../core/Delete"
import InputField from "../core/components/InputField"
import RichTextField from "../core/components/RichTextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../lib/helpers"
import Errors from "../core/components/Errors"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onClose() {
        const { entity } = this.props.data
        this.props.history.push(entity.url)
    }

    @autobind
    onDeleteClick(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    afterDelete() {
        window.location.href = '/cms'
    }

    @autobind
    onSubmit(e) {
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        const { entity } = this.props.data

        let input = {
            clientMutationId: 1,
            guid: entity.guid,
            title: values.title,
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description))
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
        let { entity, viewer } = this.props.data
        
        if (!entity) {
            return (
                <div />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        let description
        if (entity.pageType == "text") {
            description = (
                <RichTextField ref="richText" name="description" placeholder="Beschrijving" value={entity.description} richValue={entity.richDescription} rules="required" value={entity.description} richValue={entity.richDescription} />
            )
        }

        return (
            <ActionContainer title="Pagina wijzigen" onClose={this.onClose}>
                <Form ref="form" onSubmit={this.onSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                                {errors}
                                <div className="form">
                                    <InputField label="Title" name="title" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus value={entity.title} />
                                    {description}
                                    <div className="buttons ___space-between">
                                        <button className="button" type="submit">Wijzigen</button>
                                        <button className="button ___link" onClick={this.onDeleteClick}>Verwijderen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
                <DeleteCore title="Pagina verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </ActionContainer>
        )
    }
}

const Query = gql`
    query EditPage($guid: Int!) {
        viewer {
            guid
            loggedIn
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            ... on Page {
                title
                description
                richDescription
                pageType
                url
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

const Mutation = gql`
mutation editEntity($input: editEntityInput!) {
    editEntity(input: $input) {
        entity {
            guid
        }
    }
}
`

export default graphql(Mutation)(graphql(Query, Settings)(Edit))