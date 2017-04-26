import React from "react"
import classnames from "classnames"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const Translation = {
    invited: 'Uitgenodigd',
    requested: 'Aangevraagd',
    member: 'Lid',
    notmember: 'Geen lid',
    admin: 'Beheerder',
    owner: 'Eigenaar'
}

class InviteItem extends React.Component {
    constructor(props) {
        super(props)
        
        this.toggleInvite = this.toggleInvite.bind(this)

        this.state = {
          invited: this.props.invited
        }      
    }

    toggleInvite() {
        const { user, group } = this.props

        const newState = !this.state.invited

        if (newState) {
            const input = {
                clientMutationId: 1,
                guid: group.guid,
                userGuidOrEmail: user.guid
            }

            this.props.mutate({
                variables: {
                    input
                }
            }).then(({data}) => {
                // do nothing
            }).catch((errors) => {
                logErrors(errors)
                this.setState({
                    errors: errors
                })
            })
        }

        this.setState({ invited: !this.state.invited })
    }

    componentDidMount() {
        const status = this.props.status
        if (status == "notmember" || status == "requested") {
            this.setState({ invited: false })
        } else {
            this.setState({ invited: true })
        }

    }

    render() {
        const { user, status } = this.props
        // Voor een beheerder moet de button disabled zijn
        // Voor een status requeted (status: aangevraagd) moet deze knop accepteren
        // Voor een status invited moet deze knop disabled zijn
        
        const inviteButton = (
        <div className={classnames({"button ___square ___grey list-members__add":true, "___is-invited": this.state.invited})} onClick={this.toggleInvite}>
            <div className="list-members__add-icons">
                <span className="___check" /><span className="___plus" />
            </div>
        </div>
        );

        return (
            <div className="col-sm-6">
                <div className="list-members__member">
                    <div className="list-members__picture" style={{backgroundImage: `url(${user.icon})`}} />
                    <div className="list-members__name">
                        {user.name}<br />
                        {Translation[status]}
                    </div>
                    {inviteButton}
                </div>
            </div>
        )
    }
}

const Mutation = gql`
    mutation InviteItem($input: inviteToGroupInput!){
      inviteToGroup(input: $input) {
        group {
            ... on Group {
                guid
            }
        }
      }
    }
`

export default graphql(Mutation)(InviteItem)