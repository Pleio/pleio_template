import React from "react"
import classnames from "classnames"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

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

    render() {
        const { user } = this.props

        return (
            <div className="col-sm-6">
                <div className="list-members__member">
                    <div className="list-members__picture" style={{backgroundImage: `url(${user.icon})`}} />
                    <div className="list-members__name">
                        {user.name}
                    </div>
                    <div className={classnames({"button ___square ___grey list-members__add":true, "___is-invited": this.state.invited})} onClick={this.toggleInvite}>
                        <div className="list-members__add-icons">
                            <span className="___check" /><span className="___plus" />
                        </div>
                    </div>
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