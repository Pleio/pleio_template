import React from "react"
import Document from "./components/Document"

export default class Contact extends React.Component {
    render() {
        return (
            <div>
                <Document title="Privacy" />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                                <article className="article">
                                    <h3 className="article__title">Privacy</h3>
                                    <div className="content">
                                        <p>Persoonsgegevens die je opgeeft op deze site gebruiken we alleen voor het doel waarvoor je ze hebt achtergelaten. Daarmee voldoen we aan de privacywetgeving.</p>
                                        <p>Let wel op dat de gegevens die je opgeeft in je profiel (zoals school, website, mailadres, telefoonnummer) voor iedereen zichtbaar zijn en dat bij je blogs, reacties en forumposts voor- en achternaam worden getoond.</p>
                                        <p>Deze site maakt gebruik van cookies die surfgedrag bijhouden. Dit zijn analytische cookies. Daarmee krijgen we inzicht in hoe bezoekers de website gebruiken. Deze informatie helpt ons om de site te verbeteren en meer informatie op maat te kunnen bieden.</p>
                                        <p>Algemene informatie over cookies vind je op <a href="https://www.rijksoverheid.nl">Rijksoverheid.nl</a>.</p>

                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}