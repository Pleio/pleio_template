import React from "react"
import ContentFiltersInputField from "../../core/components/ContentFiltersInputField"
import Select from "../../core/components/NewSelect"
import Switches from "../../core/components/Switches"
import Form from "../../core/components/Form"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SettingsInterests extends React.Component {
    constructor(props) {
        super(props)

        this.submit = this.submit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(name, isChecked) {
        clearTimeout(this.submitTimeout)
        this.submitTimeout = setTimeout(() => {
            this.submit()
        }, 500)
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
            },
            refetchQueries: [ "InfiniteList" ]
        })
    }

    render() {
        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Stel hier je interesses in</h3>
                <Form ref="form">
                    <ContentFiltersInputField name="tags" value={this.props.entity.tags} onChange={this.onChange} noWrap />
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

export default graphql(Query)(SettingsInterests)