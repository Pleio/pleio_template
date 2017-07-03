import React from "react"
import { Link, withRouter } from "react-router-dom"

class LoggedInButton extends React.Component {
    render() {
        const { location, viewer } = this.props

        if (viewer.loggedIn) {
            return (
                <div title={this.props.title} className={this.props.className} onClick={this.props.onClick}>
                    {this.props.title}
                </div>
            )
        } else {
            return (
                <Link to={{pathname: "/login", state: { fromAddContent: this.props.fromAddContent, fromComment: this.props.fromComment, next: location.pathname }}}>
                    <div title={this.props.title} className="button article-action ___comment">
                        {this.props.title}
                    </div>
                </Link>
            )
        }
    }
}

export default withRouter(LoggedInButton)