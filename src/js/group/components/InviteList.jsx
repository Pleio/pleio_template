import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import InviteItem from "./InviteItem"

class InviteList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: ""
        }
    }

    onChange(e) {
        this.setState({ q: e.props.q })
    }


    render () {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        const List = entity.invite.edges.map((invite, i) => (
            <InviteItem key={i} group={entity} user={invite.user} status={invite.status} />
        ))


        return (
            <div className="list-members">
                <div className="row">
                    {List}
                </div>
            </div>
        )
    }
}

/*const Query = gql`
    query InviteList($guid: String!, $q: String){
      entity(guid: $guid) {
        guid
        ... on Group {
          invite(q: $q) {
            edges {
                invited
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
                guid: ownProps.entity.guid,
                q: ownProps.q
            }
        }
    }
}

export default graphql(Query, Settings)(InviteList)*/

export default class InviteListWithData extends React.Component {
    render() {
        const data = {
            "entity": {
              "guid": "1445",
              "invite": {
                "edges": [
                  {
                    "status": "invited",
                    "user": {
                      "guid": "1428",
                      "username": "user",
                      "name": "Invited user",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "requested",
                    "user": {
                      "guid": "1412",
                      "username": "manager",
                      "name": "Requested user",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "member",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Member",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "notmember",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Not member",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "admin",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Administrator",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "admin",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Administrator",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "owner",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Eind baas",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "invited",
                    "user": {
                      "guid": "1428",
                      "username": "user",
                      "name": "Invited user",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "requested",
                    "user": {
                      "guid": "1412",
                      "username": "manager",
                      "name": "Requested user",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "member",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Member",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  },
                  {
                    "status": "notmember",
                    "user": {
                      "guid": "864",
                      "username": "admin",
                      "name": "Not member",
                      "icon": "http://www.pleio.dev/mod/pleio_template/src/images/user.png"
                    }
                  }
                ]
              }
            }
          }

        return (
            <InviteList data={data} />
        )
    }
}