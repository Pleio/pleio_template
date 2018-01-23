import React from "react"
import autobind from "autobind-decorator"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import Errors from "../../core/components/Errors"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SubgroupAdd extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onSubmit(e) {
        const { entity } = this.props

        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    name: values.name,
                    members: [],
                    groupGuid: entity.guid
                }
            },
            refetchQueries: ["SubgroupsList"]
        }).then(({data}) => {
            this.refs.form.clearValues()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Form ref="form" className="form" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <InputField label="Maak een subgroep" name="name" type="text" placeholder="Naam" className="form__input" rules="required" autofocus />
                <button className="button" type="submit">Aanmaken</button>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation SubgroupsModal($input: addSubgroupInput!) {
        addSubgroup(input: $input) {
            success
        }
    }
`

export default graphql(Mutation)(SubgroupAdd)