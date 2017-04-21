import React from "react"
import Form from "../core/components/Form"
import IconField from "../core/components/IconField"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        const values = this.refs.form.getValues()
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    avatar: values.avatar
                }
            }
        }).then(({data}) => {
            location.reload()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <IconField name="avatar" />
                <button className="button ___primary" type="submit">
                    Opslaan
                </button>
            </Form>
        )
    }
}

const Query = gql`
    mutation editAvatar($input: editAvatarInput!) {
        editAvatar(input: $input) {
            user {
                guid
            }
        }
    }
`

export default graphql(Query)(ProfilePicture)