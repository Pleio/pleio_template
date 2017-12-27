import React from "react"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import AccessField from "../../core/components/AccessField"
import FileField from "../../core/components/FileField"
import TagsField from "../../core/components/TagsField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"

class EditFileFolder extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: [],
            isUploading: false
        }
    }

    onSubmit(e) {
        const { entity } = this.props

        this.setState({
            errors: [],
            isUploading: true
        })

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid,
                    title: values.title,
                    file: values.file,
                    accessId: values.accessId,
                    writeAccessId: values.writeAccessId,
                }
            }
        }).then(({data}) => {
            this.props.onComplete()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors,
                isUploading: false
            })
        })
    }

    render() {
        const { entity } = this.props

        let file
        if (entity.subtype == "file") {
            file = (
                <FileField name="file" label="Bestand (vervangen)" className="form__input" />
            )
        }

        let permissions
        if (window.__SETTINGS__['advancedPermissions']) {
            permissions = (
                <div>
                    <AccessField name="accessId" label="Leesrechten" value={entity.accessId} />
                    <AccessField write name="writeAccessId" label="Schrijfrechten" value={entity.writeAccessId} />
                </div>
            )
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="form">
                    <InputField name="title" type="text" label="Naam" className="form__input" value={entity.title} />
                    {file}
                    {permissions}
                    <button className="button" type="submit">
                        Wijzigen
                    </button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation editFileFolder($input: editFileFolderInput!) {
        editFileFolder(input: $input) {
            entity {
                guid
                ... on Object {
                    title
                    accessId
                    writeAccessId
                }
            }
        }
    }
`
const EditFileFolderWithMutation = graphql(Mutation)(EditFileFolder)

export default class EditFileFolderModal extends React.Component {
    constructor(props) {
        super(props)
        this.onComplete = this.onComplete.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    onComplete() {
        this.props.onComplete()
        this.toggle()
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        if (!entity) {
            return (
                <div />
            )
        }

        let title
        if (entity.subtype === "file") {
            title = "Bestand wijzigen"
        } else {
            title = "Map wijzigen"
        }

        return (
            <Modal ref="modal" title={title} medium>
                <EditFileFolderWithMutation {...this.props} onComplete={this.onComplete} />
            </Modal>
        )
    }
}