import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../../lib/helpers"
import Errors from "../Errors"
import classnames from "classnames"

class AddDocument extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.triggerFileSelect = this.triggerFileSelect.bind(this)

        this.state = {
            uploading: false,
            errors: []
        }
    }

    triggerFileSelect(e) {
        this.refs.file.click()
    }

    convertFileListToArray(input) {
        let files = []

        for (var i = 0; i < input.length; i++) {
            files.push(input[i])
        }

        return files
    }

    onChange(e) {
        this.setState({
            uploading: true
        })

        Promise.all(this.convertFileListToArray(e.target.files).map((file) => {
            return this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        file
                    }
                }
            }).then(({data}) => {
                this.props.onSubmit(file.name, {
                    guid: data.addFile.entity.guid,
                    mimeType: file.type,
                    size: file.size,
                    url: `/file/download/${data.addFile.entity.guid}`
                })
            })
        })).then(({data}) => {
                this.setState({
                    uploading: false,
                    errors: []
                })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                uploading: false,
                errors: errors
            })
        })
    }

    render() {
        let content

        if (this.state.uploading) {
            return (
                <div>
                    <p>Kies een of meerdere documenten. Let op, de documenten mogen maximaal 10MB groot zijn.</p>
                    <div className="editor__upload">
                        <span>Bezig met uploaden...</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <p>Kies een of meerdere documenten. Let op, de documenten mogen maximaal 10MB groot zijn.</p>
                    <div className="editor__upload" onClick={this.triggerFileSelect}>
                        <Errors errors={this.state.errors} />
                        <input ref="file" type="file" name="document" onChange={this.onChange} className="___is-hidden" multiple accept=".pdf,.csv,.png,.jpg,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
                        <span>+ Bestand(en) uploaden</span>
                    </div>
                </div>
            )
        }
    }
}

const Query = gql`
    mutation addDocument($input: addFileInput!) {
        addFile(input: $input) {
            entity {
                guid
            }
        }
    }
`
const withQuery = graphql(Query)
export default withQuery(AddDocument)