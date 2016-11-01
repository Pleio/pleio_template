import React from "react"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import Errors from "../../core/components/Errors"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AccountEmail extends React.Component {
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

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    email: values.email
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
                        Je e-mailadres is bijna veranderd. Controleer je nieuwe e-mailadres en bevestig de wijziging door het volgen van de link.
                    </div>
                </div>
            )
        } else {
            content = (
                <div className="row">
                    <div className="col-sm-5">
                        <Errors errors={this.state.errors} />
                        <Form ref="form" className="form" onSubmit={this.onSubmit}>
                            <InputField name="email" type="text" placeholder="Nieuw e-mailadres" rules="required|email" value={this.props.entity.email} />
                            <button className="button ___large" type="submit">
                                Wijzigen
                            </button>
                        </Form>
                    </div>
                </div>
            )
        }

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">E-mailadres</h3>
                {content}
            </div>
        )
    }
}

const Query = gql`
    mutation editEmail($input: editEmailInput!) {
        editEmail(input: $input) {
            user {
                guid
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(AccountEmail)