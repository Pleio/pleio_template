import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import ProfilePicture from "./ProfilePicture"
import { showModal } from "../lib/actions"
import NotFound from "../core/NotFound"
import Document from "../core/components/Document"
import ProfileField from "./components/ProfileField"
import ProfileScore from "./components/ProfileScore"

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.editPicture = this.editPicture.bind(this)
    }

    editPicture(e) {
        this.props.dispatch(showModal("profile-picture"))
    }

    render() {
        let { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div className="page-layout"></div>
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
                value: item.value
            }
        })

        const contactData = ['phone', 'mobile', 'emailaddress', 'site'].map((key, i) => (
            <ProfileField key={i} entity={entity} canEdit={entity.canEdit} dataKey={key} name={profileByKey[key].name} value={profileByKey[key].value} />
        ))

        const siteProfile = ['sector', 'school'].map((key, i) => (
            <ProfileField key={i} entity={entity} canEdit={entity.canEdit} dataKey={key} name={profileByKey[key].name} value={profileByKey[key].value} />
        ))

        let editProfile, profileScore
        if (entity.canEdit) {
            editProfile = (
                <div className="card-profile__edit-picture" onClick={this.editPicture}>
                    Profielfoto bewerken
                </div>
            )
            profileScore = (
                <ProfileScore entity={entity} />
            )
        }

        const stats = {}
        entity.stats.forEach((stat) => {
            stats[stat.key] = stat.value
        })

        return (
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
                                            <li><span>Contactgegevens</span></li>
                                            {contactData}
                                        </ul>
                                    </div>
                                    <div className="col-sm-12 col-lg-4">
                                        {profileScore}
                                        <ul className="card-profile__social">
                                            <li>
                                                <label>Antwoorden:</label>
                                                <span>{stats.answers || 0}</span>
                                            </li>
                                            <li>
                                                <label>Stemmen omhoog:</label>
                                                <span>{stats.upvotes || 0}</span>
                                            </li>
                                            <li>
                                                <label>Stemmen omlaag:</label>
                                                <span>{stats.downvotes || 0}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-profile">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <div className="card-profile__icon"></div>
                            </div>
                            <div className="col-sm-8 col-lg-6">
                                <ul className="card-profile__details">
                                    {siteProfile}
                                </ul>
                                <ProfileField type="textarea" entity={entity} canEdit={entity.canEdit} dataKey="description" name={profileByKey.description.name} value={profileByKey.description.value} className="card-profile__about" />
                            </div>
                            <div className="col-lg-3"></div>
                        </div>
                    </div>
                </div>
                <ProfilePicture entity={entity} />
            </section>
        )
    }
}

const query = gql`
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
                }
                stats {
                    key
                    name
                    value
                }
            }
        }
    }
`;

export default connect()(graphql(query, {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.params.username
            }
        }
    }
})(Profile))