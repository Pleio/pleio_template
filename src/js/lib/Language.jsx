import React from 'react'

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
    children: React.PropTypes.object.isRequired
}

Language.childContextTypes = {
    currentLanguage: React.PropTypes.string.isRequired
}

export default Language;