import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Profile extends React.Component {
    render() {
        let { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div className="page-layout"></div>
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

        let contactData = ['phone', 'mobile', 'email', 'site'].map((key, i) => (
            <li key={i}>
                <label>{profileByKey[key].name}</label>
                <span>{profileByKey[key].value}</span>
            </li>
        ))

        return (
            <section className="section ___grey ___grow">
                <div className="container">
                    <div className="card-profile">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <div style={pictureStyles} className="card-profile__picture">
                                    <div className="card-profile__edit-picture">Profielfoto bewerken</div>
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
                                        <div className="card-profile__status">
                                            <span>Redelijk profiel</span>
                                        </div>
                                        <ul className="card-profile__social">
                                            <li>
                                                <label>Likes:</label>
                                                <span>0</span>
                                            </li>
                                            <li>
                                                <label>Antwoorden:</label>
                                                <span>0</span>
                                            </li>
                                            <li>
                                                <label>Stemmen omhoog:</label>
                                                <span>0</span>
                                            </li>
                                            <li>
                                                <label>Stemmen omlaag:</label>
                                                <span>0</span>
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
                                    <li>
                                        <label>Onderwijssector</label><span>Primair onderwijs</span>
                                    </li>
                                    <li>
                                        <label>School</label><span>Montessorischool Eindhoven</span>
                                    </li>
                                </ul>
                                <div className="card-profile__about"><strong>Over mij</strong>
                                    <p>Nonsendit volupti im rem et volupta quatemo luptate dolupta niendae sanduci quuntet quo berem autem haritat iumquam qui cum quis reprorior sitem remos eius accusanis esequid mod molori res as alique voluptus modita qui bearum cupta doloribearum a conseque ommodic idissum esed quiande verferis etur rem doluptae atur, nullaceatur?</p>
                                    <p>Ut as magnimus quas link quiatqui quis et officim veles autaestis aces quam, utemporepro qui doluptatis dust vid quiande idem vendandia nusaeperiti utem dolorem que cor aut as voluptatis aliatem quis modi quaspid ellupta erundis mi, od ex esequaturia voloribus aut repro verior sedi bea quiam remporessit, utas num quia dolupta consereium vel ium id ut magnatus reribus.</p>
                                </div>
                            </div>
                            <div className="col-lg-3"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const query = gql`
    query ProfileWrapper($username: String!) {
        entity(username: $username) {
            ...userProfileFragment
        }
    }

    fragment userProfileFragment on User {
        guid
        icon
        profile {
            key
            name
            value
        }
    }
`;

export default graphql(query, {
    options: (ownProps) => {
        return {
            variables: {
                username: ownProps.params.username
            }
        }
    }
})(Profile);