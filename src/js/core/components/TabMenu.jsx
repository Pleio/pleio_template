import React from "react"
import { Link } from "react-router-dom"
import Select from "./NewSelect"
import classnames from "classnames"
import PropTypes from "prop-types"

class TabMenu extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        this.props.history.push(value)
    }

    render() {
        const { router } = this.context
        const path = router.route.location.pathname + router.route.location.search

        let selected = null
        let selectOptions = []
        this.props.options.forEach((item, i) => {
            selectOptions[item.link] = item.title
            if (path === item.link) {
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
    router: PropTypes.object
}

export default TabMenu