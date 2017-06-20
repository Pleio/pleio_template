import React from "react"
import { Link, withRouter } from "react-router-dom"
import Select from "./NewSelect"
import classnames from "classnames"
import autobind from "autobind-decorator"

class TabMenu extends React.Component {
    @autobind
    onChange(value) {
        const { history, match } = this.props
        history.push(value)
    }

    render() {
        const { history, match, location } = this.props

        const url = location.pathname + location.search

        let selected = null
        let selectOptions = []
        this.props.options.forEach((item, i) => {
            selectOptions[item.link] = item.title
            if (url.indexOf(item.link) !== -1) {
                selected = item.link
            }
        })

        let content = this.props.options.map((item, i) => (
            <Link key={i} to={item.link} className={classnames({"tabmenu__link": true, "___is-active": item.link === selected})}>
                {item.title}
            </Link>
        ))

        return (
            <div>
                <div className="tabmenu">
                    {content}
                </div>
                <div className="tabmenu__dropdown">
                    <Select name="tabmenu" onChange={this.onChange} options={selectOptions} value={selected} className="___is-mobile-only ___margin-top ___margin-bottom" />
                </div>
            </div>
        )
    }
}

export default withRouter(TabMenu)