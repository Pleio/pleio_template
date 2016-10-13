import React from 'react'

export default class Errors extends React.Component {
    render() {
        let errors = [];
        if (this.props.errors.graphQLErrors) {
            errors = this.props.errors.graphQLErrors.map((error) => { return error.message })
        } else {
            errors.push(this.props.errors.message)
        }

        let displayErrors = errors.map(function(error) {
            return (
                <div key={error}>{error}</div>
            )
        }.bind(this))

        return (
            <div className="messages error">{displayErrors}</div>
        )
    }
}