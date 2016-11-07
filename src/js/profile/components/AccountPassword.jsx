import React from "react"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import Errors from "../../core/components/Errors"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AccountPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: [],
            success: false
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        const values = this.refs.form.getValues()

        if (values.newPassword !== values.newPasswordAgain) {
            this.setState({
                errors: {message: "passwords_not_the_same"}
            })
            return;
        }

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true,
                errors: []
            })
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let content, errors

        if (this.state.success) {
            content = (
                <div className="row">
                    <div className="col-sm-5">
                        Je wachtwoord is succesvol veranderd.
                    </div>
                </div>
            )
        } else {
            content = (
                <div className="row">
                    <div className="col-sm-5">
                        <Errors errors={this.state.errors} />
                        <Form ref="form" className="form" onSubmit={this.onSubmit}>
                            <InputField name="oldPassword" type="password" placeholder="Huidige wachtwoord" rules="required" />
                            <InputField name="newPassword" type="password" placeholder="Je nieuwe wachtwoord" rules="required|min:8" />
                            <InputField name="newPasswordAgain" type="password" placeholder="Vul je nieuwe wachtwoord nogmaals in" rules="required|min:8" />
                            <button className="button ___large" type="submit">
                                Update wachtwoord
                            </button>
                        </Form>
                    </div>
                </div>
            )
        }

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Wachtwoord</h3>
                {content}
            </div>
        )
    }
}

const Query = gql`
    mutation editPassword($input: editPasswordInput!) {
        editPassword(input: $input) {
            user {
                guid
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(AccountPassword)