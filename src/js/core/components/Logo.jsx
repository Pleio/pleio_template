import React from "react"
import { Link } from "react-router"

export default class Logo extends React.Component {
    render() {
        const { site } = this.props.data

        return (
            <header className="header">
                <div className="container">
                    <Link to="/" className="header__logo" title="Terug naar home">
                        <img src={site.logo} alt={site.name} />
                    </Link>
                </div>
            </header>
        )
    }
}