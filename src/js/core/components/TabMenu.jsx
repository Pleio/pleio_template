import React from "react"
import { Link } from "react-router"

export default class TabMenu extends React.Component {
    render() {
        let content = this.props.options.map((item, i) => (
            <Link key={i} to={item.link} onlyActiveOnIndex={true} activeClassName="___is-active" className="tabmenu__link">
                {item.title}
            </Link>
        ))

        return (
            <div className="tabmenu">
                {content}
            </div>
        )
    }
}