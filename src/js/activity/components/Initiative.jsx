import React from "react"
import { Link } from "react-router"

export default class Initiative extends React.Component {
    render() {
        return (
            <div className="col-sm-6 col-lg-12">
                <div className="card-initiative">
                    <div className="card-initiative__title">
                        Initiatief van
                    </div>
                    <div className="card-initiative__line"></div>
                    <img src="/mod/pleio_template/src/images/logo.svg" className="card-initiative__logo" />
                    <a href="https://www.rijksoverheid.nl/ministeries/ministerie-van-onderwijs-cultuur-en-wetenschap" target="_blank" className="card-initiative__link">
                        Naar de website
                    </a>
                </div>
                <div className="footer">
                    <Link to="/campagne" title="Over" className="footer__link">Over</Link>
                    <Link to="/pages/terms" title="Spelregels" className="footer__link">Spelregels</Link>
                    <Link to="/pages/privacy" title="Privacy" className="footer__link">Privacy</Link>
                    <Link to="/pages/contact" title="Contact" className="footer__link">Contact</Link>
                </div>
            </div>
        )
    }
}