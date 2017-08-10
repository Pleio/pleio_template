import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

export default class Initiative extends React.Component {
    render() {
        const { site } = this.props

        if (!site.logo || !site.showInitiative) {
            return (
                <div />
            )
        }

        let link
        if (site.initiatorLink) {
            link = (
                <a href={site.initiatorLink} target="_blank" className="card-initiative__link">
                    Naar de website
                </a>
            )
        }

        return (
            <div className="col-sm-6 col-lg-12">
                <div className="card-initiative">
                    <div className="card-initiative__title">
                        Initiatief van
                    </div>
                    <div className="card-initiative__line"></div>
                    <img src={site.logo} className="card-initiative__logo" />
                    {link}
                </div>
            </div>
        )
    }
}