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
            <Link key={i} to={item.link} className={classnames({"___is-active": item.link === selected})}>
                {item.title}
            </Link>
        ))

        return (
            <div>
                <div className={this.props.className || "tabmenu"}>
                    {content}
                    {this.props.children}
                </div>
                <div className="row">
                    <div className="col-sm-4 col-lg-3">
                        <div className={classnames({"tabmenu__dropdown": true, "___group": this.props.group})}>
                            <Select name="tabmenu" onChange={this.onChange} options={selectOptions} value={selected} className={classnames({"___is-mobile": true, "___is-mobile-only": true, "___margin-bottom": this.props.marginBottom})} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TabMenu)