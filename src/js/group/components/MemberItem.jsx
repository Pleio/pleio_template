import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import Select from "../../core/components/NewSelect"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"
import classnames from "classnames"
import autobind from "autobind-decorator"

class MemberItem extends React.Component {
    constructor(props) {
        super(props)

        const { member } = this.props

        this.state = {
            role: member.role,
            errors: []
        }
    }

    @autobind
    onChange(role) {
        const { group, member } = this.props

        if (role == "removed") {
            if (!confirm("Weet je zeker dat je deze gebruiker wil verwijderen?")) {
                return
            }
        }

        this.setState({ role })

        const input = {
            clientMutationId: 1,
            guid: group.guid,
            userGuid: member.user.guid,
            role
        }

        this.props.mutate({
            variables: {
                input
            },
            refetchQueries: ["MembersList"]
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        const { member } = this.props

        let editable
        if (this.props.editable && this.state.role !== "owner") {
            editable = (
                <Select className="selector ___no-line" options={{member: "Lid", admin: "Beheerder", removed: "Verwijderen"}} value={this.state.role} onChange={this.onChange} />
            )
        }

        return (
            <div className="list-members__member">
                <Errors errors={this.state.errors} />
                <div style={{backgroundImage: `url('${member.user.icon}')`}} className="list-members__picture" />
                <div className="list-members__name"><b>{member.user.name}</b></div>
                {editable}
            </div>
        )
    }
}

const Mutation = gql`
    mutation MemberItem($input: changeGroupRoleInput!){
      changeGroupRole(input: $input) {
        group {
            ... on Group {
                guid
            }
        }
      }
    }
`

export default graphql(Mutation)(MemberItem)