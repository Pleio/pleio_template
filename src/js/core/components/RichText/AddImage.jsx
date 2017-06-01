import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../../lib/helpers"
import Errors from "../Errors"
import classnames from "classnames"

class AddImage extends React.Component {
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

    onChange(e) {
        const image = e.target.files[0]
        if (!image) {
            return
        }

        this.setState({
            uploading: true
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    image: image
                }
            }
        }).then(({data}) => {
            this.props.onSubmit("IMAGE", {
                src: data.addImage.file.url
            })

            this.setState({
                uploading: false,
                errors: []
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let content

        if (this.state.uploading) {
            return (
                <div className="editor__upload">
                    <span>Bezig met uploaden...</span>
                </div>
            )
        } else {
            return (
                <div className="editor__upload" onClick={this.triggerFileSelect}>
                    <input ref="file" type="file" name="image" onChange={this.onChange} className="___is-hidden" accept="image/*" />
                    <span>+ Afbeelding uploaden</span>
                </div>
            )
        }
    }
}

const Query = gql`
    mutation addImage($input: addImageInput!) {
        addImage(input: $input) {
            file {
                guid
                url
            }
        }
    }
`
const withQuery = graphql(Query)
export default withQuery(AddImage)