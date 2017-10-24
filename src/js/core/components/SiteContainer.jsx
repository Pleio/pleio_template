import React from "react"
import PropTypes from "prop-types"

class SiteContainer extends React.Component {
    getChildContext() {
        return {
            site: window.__SETTINGS__["site"]
        }
    }

    render() {
        return React.Children.only(this.props.children)
    }
}

SiteContainer.childContextTypes = {
    site: PropTypes.object
}

export default SiteContainer