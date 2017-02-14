import React from "react"
import ContentFiltersInputField from "../../core/components/ContentFiltersInputField"
import Select from "../../core/components/NewSelect"
import Switches from "../../core/components/Switches"
import Form from "../../core/components/Form"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

let submitTimeout

class SettingsInterests extends React.Component {
    constructor(props) {
        super(props)

        this.submit = this.submit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(name, isChecked) {
        clearTimeout(submitTimeout)
        submitTimeout = setTimeout(() => {
            this.submit()
        }, 1000)
    }

    submit() {
        const { form } = this.refs

        const values = form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    tags: values.tags
                }
            }
        })
    }

    render() {
        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Stel hier je interesses in</h3>
                <Form ref="form" onChange={this.onChange}>
                    <ContentFiltersInputField name="tags" value={this.props.entity.tags} />
                </Form>
            </div>
        )
    }
}

const Query = gql`
    mutation editInterests($input: editInterestsInput!) {
        editInterests(input: $input) {
            user {
                guid
                tags
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(SettingsInterests)