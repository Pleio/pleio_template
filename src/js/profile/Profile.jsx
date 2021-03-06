import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ProfilePicture from "./ProfilePicture"
import NotFound from "../core/NotFound"
import Document from "../core/components/Document"
import ProfileField from "./components/ProfileField"
import Modal from "../core/components/Modal"
import Wrapper from "./components/Wrapper"
import { OrderedSet } from "immutable"

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.editPicture = this.editPicture.bind(this)
    }

    editPicture(e) {
        this.refs.profilePictureModal.toggle()
    }

    render() {
        let { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status ===404) {
            return (
                <NotFound />
            )
        }


        let pictureStyles = {
            background: "url('" + this.props.data.entity.icon + "') no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }

        let profileByKey = {}
        entity.profile.forEach((item) => {
            profileByKey[item.key] = {
                name: item.name,
                value: item.value,
                accessId: item.accessId
            }
        })

        const allFields = new OrderedSet(Object.keys(profileByKey))

        const defaultFields = new OrderedSet(["emailaddress", "site", "phone", "mobile", "aboutme"])
        const topFields = new OrderedSet(["emailaddress", "site", "phone", "mobile"])

        const contactData = topFields.intersect(defaultFields).map((key, i) => (
            <ProfileField key={i} entity={entity} canEdit={entity.canEdit} dataKey={key} field={profileByKey[key]} />
        ))

        const siteProfile = allFields.subtract(defaultFields).map((key, i) => (
            <ProfileField key={i} entity={entity} canEdit={entity.canEdit} dataKey={key} field={profileByKey[key]} />
        ))

        let editProfile
        if (entity.canEdit) {
            editProfile = (
                <div className="card-profile__edit-picture" onClick={this.editPicture}>
                    Profielfoto bewerken
                </div>
            )
        }

        const stats = {}
        entity.stats.forEach((stat) => {
            stats[stat.key] = stat.value
        })

        return (
            <Wrapper match={this.props.match}>
                <section className="section ___grey ___grow">
                    <Document title={entity.name} />
                    <div className="container">
                        <div className="card-profile">
                            <div className="row">
                                <div className="col-sm-4 col-lg-3">
                                    <div style={pictureStyles} className="card-profile__picture">
                                        {editProfile}
                                    </div>
                                </div>
                                <div className="col-sm-8 col-lg-9">
                                    <div className="row">
                                        <div className="col-sm-12 col-lg-8">
                                            <ul className="card-profile__details">
                                                <li><strong>Contactgegevens</strong></li>
                                                {contactData}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-profile">
                            <div className="row">
                                <div className="col-sm-4 col-lg-3"></div>
                                <div className="col-sm-8 col-lg-6">
                                    <ul className="card-profile__details">
                                        {siteProfile}
                                    </ul>
                                    <ProfileField type="richTextarea" entity={entity} canEdit={entity.canEdit} dataKey="aboutme" field={profileByKey.aboutme} className="card-profile__about" />
                                </div>
                                <div className="col-lg-3"></div>
                            </div>
                        </div>
                    </div>
                    <Modal ref="profilePictureModal" title="Bewerk profielfoto">
                        <ProfilePicture entity={entity} />
                    </Modal>
                </section>
            </Wrapper>
        )
    }
}

const Query = gql`
    query Profile($username: String!) {
        entity(username: $username) {
            guid
            status
            ... on User {
                name
                canEdit
                icon
                profile {
                    key
                    name
                    value
                    accessId
                }
                stats {
                    key
                    name
                    value
                }
            }
        }
    }
`

const Settings =  {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.match.params.username
            }
        }
    }
}

export default graphql(Query, Settings)(Profile)