import React from "react"
import PropTypes from "prop-types"

class Language extends React.Component {
    render() {
        return this.props.children;
    }

    getChildContext() {
        return {
            currentLanguage: this.props.currentLanguage
        }
    }
}

Language.propTypes = {
    children: PropTypes.object.isRequired
}

Language.childContextTypes = {
    currentLanguage: PropTypes.string.isRequired
}

export default Language;