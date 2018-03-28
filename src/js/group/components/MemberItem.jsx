import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import Select from "../../core/components/NewSelect"
import CheckField from "../../core/components/CheckField"
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

    componentWillUpdate(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ role: nextProps.member.role })
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

        if (role == "owner") {
            if (!confirm("Weet je zeker dat je het eigenaarschap van de groep wil overdragen aan deze gebruiker?")) {
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
            refetchQueries: ["MembersList", "GroupItem"]
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        const { member, group } = this.props

        let editable
        if (this.props.editable) {
            if (this.state.role !== "owner") {
                let options = { member: "Lid", admin: "Beheerder" }
                if (group.canChangeOwnership) {
                    options['owner'] = "Eigenaar"
                }

                options['removed'] = "Verwijderen"

                editable = (
                    <Select className="selector ___no-line ___not-visible-on-mobile" options={options} value={this.state.role} onChange={this.onChange} />
                )
            } else {
                editable = (
                    <div className="list-members__owner">
                        <span>Eigenaar</span>
                    </div>
                )
            }
        } else {
            if (member.role === "admin") {
                editable = (<span>Beheerder</span>)
            } else if (member.role === "owner") {
                editable = (<span>Eigenaar</span>)
            }
        }

        let selectable
        if (this.props.selectable) {
            selectable = (
                <CheckField
                    onChange={(e) => this.props.onSelect(e, member.user.guid)}
                    checked={this.props.selected.has(member.user.guid)}
                />
            )
        }

        return (
            <div className="list-members__member">
                <Errors errors={this.state.errors} />
                {selectable}
                <a className="list-members__link" href={member.user.url}>
                    <div style={{backgroundImage: `url('${member.user.icon}')`}} className="list-members__picture" />
                    <div className="list-members__name"><b>{member.user.name}</b></div>
                </a>
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