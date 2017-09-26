import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Lead extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: true,
            height: "auto"
        }

        this.onClose = this.onClose.bind(this)
    }

    onClose(e) {
        this.setState({
            height: this.refs.lead.offsetHeight
        })

        setTimeout(() => {
            this.setState({
                visible: false
            })
        }, 10)
    }

    render() {
        const { viewer, site } = this.props.data

        if (!viewer || !site || viewer.loggedIn) {
            return (
                <div></div>
            )
        }

        let style = {
            height: this.state.height,
            backgroundImage: `url(${site.leaderImage || "/mod/pleio_template/src/images/lead-home2.png"})`
        }

        if (!this.state.visible) {
            style.marginTop = 0;
            style.opacity = 0;
            style.height = 0;
        }

        let buttons
        if (site.showLeaderButtons) {
            buttons = (
                <div className="buttons ___margin-top ___gutter ___center">
                    <Link to="/campagne">
                        <div className="button ___large">
                            Over Leraar.nl
                        </div>
                    </Link>
                    <Link to="/register">
                        <div className="button ___large">
                            Aan de slag
                        </div>
                    </Link>
                </div>
            )
        }

        return (
            <div style={style} className="lead ___home" ref="lead">
                <div className="lead__close" onClick={this.onClose}>
                </div>
                <div className="lead__justify">
                    <div className="container">
                        <h1 className="lead__title">
                            {site.name}
                        </h1>
                        <h2 className="lead__sub-title">
                            {site.subtitle}
                        </h2>
                        {buttons}
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Lead {
        site {
            guid
            name
            showLeaderButtons
            subtitle
            leaderImage
        }
        viewer {
            guid
            loggedIn
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(Lead)