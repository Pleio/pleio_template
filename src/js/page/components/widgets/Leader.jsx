import React from "react"

export default class Leader extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <div style={{backgroundImage: "url('/mod/pleio_template/src/images/lead-forum.jpg')"}} className="lead ___content">
                <div className="lead__justify">
                    <div className="container" />
                </div>
            </div>
        )
    }
}