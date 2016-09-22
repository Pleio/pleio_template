import React from "react"
import classNames from "classnames"

export default class SocialShare extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggleState = (e) => this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        return (
            <div className="article-actions__share">
                <div title="Deel" className={classNames({"button article-action ___share": true, " ___is-open": this.state.isOpen})} onClick={this.toggleState}>
                    <span>Deel</span>
                </div>
                <div className={classNames({"article-share": true, " ___is-open": this.state.isOpen})}>
                    <div className="button__share ___twitter"></div>
                    <div className="button__share ___facebook"></div>
                    <div className="button__share ___google"></div>
                    <div className="button__share ___linkedin"></div>
                    <div className="button__share ___mail"></div>
                </div>
            </div>
        )
    }
}