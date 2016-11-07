import React from 'react'
import { Errors as translation } from "../../i18n/nl"

export default class Errors extends React.Component {
    render() {
        if (!this.props.errors || this.props.errors.length == 0) {
            return (
                <div></div>
            )
        }

        let errors = [];
        if (this.props.errors.graphQLErrors) {
            errors = this.props.errors.graphQLErrors.map((error) => {
                return error.message
            })
        } else {
            errors.push(this.props.errors.message)
        }

        let displayErrors = errors.map((error, i) => {
            return (
                <div key={i}>
                    {translation[error] || translation["unknown_error"]}
                </div>
            )
        })

        return (
            <div className="messages error">
                {displayErrors}
            </div>
        )
    }
}