import React from "react"

export default class Lead extends React.Component {
    render() {
        return (
            <div style={{backgroundImage: "url(" + this.props.image + ")"}} className="lead lead__content">
                <div className="lead__justify">
                    <div className="container">
                        <h1 className="lead__title">
                            {this.props.title}
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}