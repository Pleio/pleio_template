import React from "react"
import { Link } from "react-router-dom"
import TabMenu from "../../core/components/TabMenu"
import classnames from "classnames"

const types = [
    {title: "Gebruikers", type: "user"},
    {title: "Groepen", type: "group"}
]

const subtypes = [
    {title:"Mappen", subtype:"folder"},
    {title:"Bestanden", subtype:"file"},
    {title:"Blog", subtype:"blog"},
    {title:"Forum", subtype:"question"},
    {title:"Nieuws", subtype:"news"},
    {title:"Discussies", subtype:"discussion"},
    {title:"Agenda", subtype:"event"},
    {title:"Wiki", subtype:"wiki"}
]

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
        this.props.history.push(`results?q=${this.state.q}`)
    }

    render() {
        const { search } = this.props.data

        if (!search) {
            return (
                <div />
            )
        }

        let searchTotals = {}
        let total = 0

        search.totals.map((subTotal) => {
            searchTotals[subTotal.subtype] = subTotal.total
            total += subTotal.total
        })

        let options = [{
            link: `results?q=${this.state.q}`,
            title: `Alles (${total})`
        }]

        types.forEach((type) => {
            const total = searchTotals[type.type]
            if (!total) {
                return
            }

            options.push({
                link: `results?q=${this.state.q}&type=${type.type}`,
                title: `${type.title} (${total})`
            })
        })

        subtypes.forEach((subtype) => {
            const total = searchTotals[subtype.subtype]
            if (!total) {
                return
            }

            options.push({
                link: `results?q=${this.state.q}&type=object&subtype=${subtype.subtype}`,
                title: `${subtype.title} (${total})`
            })
        })

        let searchBar
        if (!this.props.noSearchBar) {
            searchBar = (
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
            )
        }

        return (
            <section className="section ___no-padding-bottom">
                <div className="container">
                    {searchBar}
                    <TabMenu options={options} />

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