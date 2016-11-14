import React from "react"

export default class Text extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <div>
                Here comes some text
            </div>
        )
    }
}