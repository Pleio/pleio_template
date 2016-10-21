import React from 'react'

export default class NotFound extends React.Component {
    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
                            <div className="http-error-page">
                                <div className="http-error-page__title">
                                    Sorry, deze pagina is niet beschikbaar
                                </div>
                                <div className="http-error-page__text">
                                    De link waarop je hebt geklikt, is mogelijk buiten werking of de pagina is verwijderd.
                                </div>
                                <div className="http-error-page__icon">
                                    <div className="icon-not-found"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}