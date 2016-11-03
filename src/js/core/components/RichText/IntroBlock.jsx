import React from "react"

export default class IntroBlock extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="article-intro">
                {this.props.children}
            </div>
        )
    }
}