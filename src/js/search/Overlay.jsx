import React from "react"
import autobind from "autobind-decorator"
import Document from "../core/components/Document"
import SearchOverlay from "./components/SearchOverlay"
import NavigationSearch from "./components/NavigationSearch"

export default class Overlay extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            q: ""
        }
    }

    componentDidMount() {
        document.body.classList.add("navigation-search-open")
    }

    componentWillUnmount() {
        document.body.classList.remove("navigation-search-open")
    }

    @autobind
    onChange(q) {
        this.setState({ q })
    }

    render() {
        return (
            <div className="page-layout">
                <Document title="Zoeken" />
                <header className="page-layout__header">
                    <nav className="navigation">
                        <div className="container">
                            <NavigationSearch onChange={this.onChange} />
                        </div>
                    </nav>
                </header>
                <SearchOverlay q={this.state.q} />
            </div>
        )
    }
}