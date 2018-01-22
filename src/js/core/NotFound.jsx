import React from "react"
import Document from "./components/Document"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class NotFound extends React.Component {
    render() {
        const { viewer } = this.props.data

        let message
        if (viewer.loggedIn) {
            message = (
                <span>De link waarop je hebt geklikt, is mogelijk buiten werking of de pagina is verwijderd.</span>
            )
        } else {
            message = (
                <span>De pagina is momenteel beschikbaar, dit kan zijn omdat je hier geen rechten tot hebt of omdat de pagina niet meer bestaat. Probeer in te loggen om de pagina te bekijken.</span>
            )
        }

        return (
            <section className="section">
                <Document title="Pagina is niet beschikbaar" />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
                            <div className="http-error-page">
                                <div className="http-error-page__title">
                                    Sorry, deze pagina is niet beschikbaar
                                </div>
                                <div className="http-error-page__text">
                                    {message}
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

const Query = gql`
    query NotFound {
        viewer {
            guid
            loggedIn
        }
    }
`

export default graphql(Query)(NotFound)