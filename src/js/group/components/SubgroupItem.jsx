import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import Select from "../../core/components/NewSelect"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"
import classnames from "classnames"
import autobind from "autobind-decorator"

class SubgroupItem extends React.Component {
    constructor(props) {
        super(props)

        const { subgroup } = this.props

        this.state = {
            value: "actions",
            errors: []
        }
    }

    @autobind
    onChange(value) {
        const { subgroup } = this.props

        if (value == "edit") {
            this.props.editSubgroup(subgroup)
        } else if (value == "remove") {
            if (!confirm("Weet je zeker dat je deze subgroep wil verwijderen?")) {
                return
            }

            const input = {
                clientMutationId: 1,
                id: subgroup.id
            }

            this.props.mutate({
                variables: {
                    input
                },
                refetchQueries: ["SubgroupsList"]
            }).catch((errors) => {
                logErrors(errors)
                this.setState({
                    errors: errors
                })
            })
        }

    }

    render() {
        const { subgroup, group } = this.props

        return (
            <div className="list-members__member">
                <Errors errors={this.state.errors} />
                <div className="list-members__name"><b>{subgroup.name}</b></div>
                <Select className="selector ___no-line ___not-visible-on-mobile" options={{ actions: "Acties", edit: "Wijzigen", remove: "Verwijderen" }} onChange={this.onChange} value={this.state.value} />
            </div>
        )
    }
}

const Mutation = gql`
    mutation SubgroupItem($input: deleteSubgroupInput!){
        deleteSubgroup(input: $input) {
            success
        }
    }
`

export default graphql(Mutation)(SubgroupItem)