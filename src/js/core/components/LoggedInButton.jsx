import React from "react"
import { Link, withRouter } from "react-router-dom"

class LoggedInButton extends React.Component {
    render() {
        const { location, viewer } = this.props

        if (viewer.loggedIn) {
            return (
                <button title={this.props.title} className={this.props.className} onClick={this.props.onClick}>
                    {this.props.children}
                </button>
            )
        } else {
            return (
                <Link to={{pathname: "/login", state: { fromAddContent: this.props.fromAddContent, fromComment: this.props.fromComment, next: location.pathname }}}>
                    <button title={this.props.title} className={this.props.className}>
                        {this.props.children}
                    </button>
                </Link>
            )
        }
    }
}

export default withRouter(LoggedInButton)