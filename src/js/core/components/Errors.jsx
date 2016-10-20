import React from 'react'

export default class Errors extends React.Component {
    render() {
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
                    {error}
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