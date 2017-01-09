import React from "react"
import { Link, browserHistory } from "react-router"
import Select from "./NewSelect"
import classnames from "classnames"

class TabMenu extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        browserHistory.push(value)
    }

    render() {
        const { router } = this.context

        let selected = null
        let selectOptions = []
        this.props.options.forEach((item, i) => {
            selectOptions[item.link] = item.title
            if (this.context.router.isActive(item.link, true)) {
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

TabMenu.contextTypes = {
    router: React.PropTypes.object
}

export default TabMenu