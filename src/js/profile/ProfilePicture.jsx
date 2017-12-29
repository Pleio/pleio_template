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

        this.state = {
            working: false
        }
    }

    onSubmit(e) {
        const values = this.refs.form.getValues()

        this.setState({ working: true })

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
                errors: errors,
                working: false
            })
        })
    }

    render() {
        let loading
        if (this.state.working) {
            loading = (
                <div className="infinite-scroll__spinner">
                    <img src="/mod/pleio_template/src/images/spinner.svg" />
                </div>
            )
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <IconField name="avatar" />
                <button className="button ___primary" type="submit" disabled={this.state.working}>
                    Opslaan
                </button>
                {loading}
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