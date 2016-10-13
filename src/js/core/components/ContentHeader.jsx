import React from 'react'
import Select from './Select'

export default class ContentHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section className={"section " + this.props.className}>
                <div className="container">
                    {this.props.children}
                </div>
            </section>
        )
    }
}