import React from 'react'

export default class Container extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}