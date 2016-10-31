import React from "react"
import { Link, browserHistory } from "react-router"
import classnames from "classnames"

const subtypes = [{title:"Blog", subtype:"blog"}, {title:"Forum", subtype:"question"}, {title:"Nieuws", subtype:"news"}]

export default class Header extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: this.props.q
        }

        this.onChange = (e) => this.setState({q: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.q !== nextProps.q) {
            this.setState({
                q: nextProps.q
            })
        }
    }

    onSubmit(e) {
        e.preventDefault()
        browserHistory.push(`/search?type=object&subtype=${this.props.subtype}&q=${this.state.q}`)
    }

    render() {
        let searchTotals = {}
        let total = 0
        this.props.totals.map((subTotal) => {
            searchTotals[subTotal.subtype] = subTotal.total
            total += subTotal.total
        })

        const tabMenu = subtypes.map((subtype, i) => (
            <Link key={i} to={`/search?type=object&subtype=${subtype.subtype}&q=${this.state.q}`} className={classnames({"tabmenu__link": true, "___is-active": (this.props.subtype === subtype.subtype)})}>
                {subtype.title} ({searchTotals[subtype.subtype] || 0})
            </Link>
        ))

        return (
            <section className="section ___no-padding-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="search-bar">
                                <form ref="form" method="GET" onSubmit={this.onSubmit}>
                                    <input name="q" onChange={this.onChange} value={this.state.q} />
                                    <div className="search-bar__button" onClick={this.onSubmit}></div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="search-bar__results">
                                {total || 0} {(total == 1) ? "resultaat" : "resultaten"}
                            </div>
                        </div>
                    </div>
                    <div className="tabmenu">
                        {tabMenu}
                    </div>

                    <div className="row">
                        <div className="col-sm-4 col-lg-3">
                            <div className="tabmenu__dropdown">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}