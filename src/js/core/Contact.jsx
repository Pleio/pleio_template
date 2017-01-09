import React from "react"
import Document from "./components/Document"

export default class Contact extends React.Component {
    render() {
        return (
            <div>
                <Document title="Contact" />
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                                <article className="article">
                                    <h3 className="article__title">Contact</h3>
                                    <div className="content">
                                        <p>Leraar.nl wordt voor een groot deel door leraren zelf vormgegeven. Wil je een bepaald onderwerp bespreken? Schrijf een blog of open een discussie op het forum.</p>
                                        <p>Wil je contact opnemen met de centrale redactie? Heb je een tip of een vraag? Mail dan naar <a href="mailto:leraar@minocw.nl">leraar@minocw.nl</a>.</p>
                                        <p>Op de contactpagina van het <a href="https://www.rijksoverheid.nl/ministeries/ministerie-van-onderwijs-cultuur-en-wetenschap/inhoud/contact-met-ocw">ministerie van OCW</a> vind je alle verschillende manieren om met het ministerie in contact te komen.</p>
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