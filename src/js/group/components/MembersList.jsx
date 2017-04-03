import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import classnames from "classnames"

class MemberCard extends React.Component {
    constructor(props) {
        super(props)
        
        this.toggleInvite = this.toggleInvite.bind(this)

        this.state = {
          inviteStatus: this.props.isInvited // werkt pas als endpoint werkt
        };        
    }

    toggleInvite(guid) {
        this.setState({"inviteStatus": !this.state.inviteStatus});
    }

    render() {
        const { member } = this.props

        return (
            <div className="list-members__member" key="{member.guid}">
                <div className="list-members__picture" style={{backgroundImage: `url(${member.icon})`}} />
                <div className="list-members__name">
                    {member.name}
                </div>
                <div className={classnames({"button ___square ___grey list-members__add":true, "___is-invited": this.state.inviteStatus})} data-invite-member="" onClick={this.toggleInvite.bind(this, member.guid)}>
                    <div className="list-members__add-icons">
                        <span className="___check" /><span className="___plus" />
                    </div>
                </div>
            </div>
        )
    }
}

class MembersList extends React.Component {
    constructor(props) {
        super(props)
    }


    render () {
        const { entity } = this.props

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <div>Geen leden gevonden</div>
            )
        }

        const List = entity.members.edges.map((member) =>
            <MemberCard member={member.user} isInvited={member.isInvited} /> // Pass 2 variabelen
        );

        return (
            <div className="list-members">
                <div className="row">
                    <div className="col-sm-6">
                       {List}
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Members($guid: String!){
      entity(guid: $guid) {
        guid
        ... on Group {
          canInvite {
            edges {
                isInvited
                user {
                    guid
                    username
                    name
                    icon
                }
            }
          }
        }
      }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.entity.guid
            }
        }
    }
}

export default graphql(Query, Settings)(MembersList)