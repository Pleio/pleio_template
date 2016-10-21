import React from "react"

export default class SearchOverlay extends React.Component {
    render() {
        return (
            <div id="searchResults" tabIndex="0" className="navigation-search-results ___small-header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <h4 className="navigation-search-results__title">Blog</h4>
                            <ul className="navigation-search-results__list">
                                <li><a href="#"><span>01-01-2016</span>Aqui qui si<strong>conecea</strong></a></li>
                                <li><a href="#"><span>01-01-2016</span>Aangiftecampagne 2016 van start</a></li>
                                <li><a href="#"><span>01-01-2015</span>Terugbetaling ten onrechte ontvangen toeslagen</a></li>
                                <li><a href="#"><span>01-01-2015</span>Afschrijving verbouwingskosten</a></li>
                            </ul>
                            <a href="zoekresultaten-blog.html" title="Bekijk alle resultaten" className="navigation-search-results__show-all">
                                Bekijk alle resultaten
                            </a>
                        </div>
                        <div className="col-lg-6">
                            <h4 className="navigation-search-results__title">Forum</h4>
                            <ul className="navigation-search-results__list">
                                <li><a href="#"><span>01-01-2016</span>Aqui qui si conecea</a></li>
                                <li><a href="#"><span>01-01-2016</span>Aangiftecampagne 2016 van start</a></li>
                                <li><a href="#"><span>01-01-2015</span>Terugbetaling ten onrechte ontvangen toeslagen</a></li>
                                <li><a href="#"><span>01-01-2015</span>Afschrijving verbouwingskosten</a></li>
                            </ul>
                            <a href="zoekresultaten-blog.html" title="Bekijk alle resultaten" className="navigation-search-results__show-all">
                                Bekijk alle resultaten
                            </a>
                        </div>
                        <div className="col-lg-6">
                            <h4 className="navigation-search-results__title">Nieuws</h4>
                            <ul className="navigation-search-results__list">
                                <li><a href="#"><span>01-01-2016</span>Aqui qui si conecea</a></li>
                                <li><a href="#"><span>01-01-2016</span>Aangiftecampagne 2016 van start</a></li>
                                <li><a href="#"><span>01-01-2015</span>Terugbetaling ten onrechte ontvangen toeslagen</a></li>
                                <li><a href="#"><span>01-01-2015</span>Afschrijving verbouwingskosten</a></li>
                            </ul>
                            <a href="zoekresultaten-blog.html" title="Bekijk alle resultaten" className="navigation-search-results__show-all">
                                Bekijk alle resultaten
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}