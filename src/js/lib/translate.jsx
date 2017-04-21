import React from "react"
import en from "../i18n/en"
import nl from "../i18n/nl"
import PropTypes from "prop-types"

const languages = {
    en,
    nl
}

export default function translate(key) {
    return Component => {
        class TranslationComponent extends React.Component {
            render() {
                var strings = languages[this.context.currentLanguage][key];
                return <Component {...this.props} {...this.state} strings={strings} />;
            }
        }

        TranslationComponent.contextTypes = {
            currentLanguage: PropTypes.string
        }

        return TranslationComponent
    }
}