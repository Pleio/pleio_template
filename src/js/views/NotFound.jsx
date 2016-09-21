import React from 'react'

export default class NotFound extends React.Component {
    render() {
        return (
            <section className="section not-found">
                <div className="container">
                    <h2 className="rhs-section__subtitle">
                        Sorry, deze pagina is niet beschikbaar
                    </h2>
                    <p>
                        De link waarop je hebt geklikt, is mogelijk buiten werking of de pagina is verwijderd.
                    </p>
                    <img src="/mod/pleio_template/src/images/404.svg" className="not-found__image" />
                </div>
            </section>
        )
    }
}