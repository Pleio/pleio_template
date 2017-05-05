import React from "react"
import Document from "./core/components/Document"
import VideoModal from "./core/components/VideoModal"
import { Link } from "react-router-dom"

export default class Campagne extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Document title="Over leraar.nl" />
                <div style={{backgroundImage: "url(/mod/pleio_template/src/images/lead-1-reversed.jpg"}} className="lead ___campagne">
                    <div className="lead__justify">
                    <div className="container">
                        <div className="lead__about" onClick={() => this.refs.videoModal.onToggle()}>
                            <div className="lead__play"></div>
                                <div className="lead__titles">
                                    <h1 className="lead__title">Over leraar.nl</h1>
                                    <h2 className="lead__sub-title">bekijk de video</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="section">
                    <div className="container">
                        <div className="campagne__intro">Welkom op leraar.nl. Hier kun je ervaringen delen uit de praktijk, informatie vinden over actuele zaken omtrent je vak en kun je vragen stellen en oplossingen aanreiken aan vakgenoten.</div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4"><img src="/mod/pleio_template/src/images/campagne-blog.png" className="campagne__image" />
                            <div className="campagne__image-title">Blog</div>
                            <p className="campagne__paragraph">Leraar.nl wordt voor een groot deel gemaakt door de leden van de community. In Blog kun je bijvoorbeeld je eigen verhaal delen met andere leraren, of juist verhalen van anderen lezen en liken. Het Forum is er om vragen te stellen en te beantwoorden, tips te delen en met elkaar in discussie te gaan.</p>
                        </div>
                            <div className="col-sm-4"><img src="/mod/pleio_template/src/images/campagne-forum.png" className="campagne__image" />
                            <div className="campagne__image-title">Forum</div>
                            <p className="campagne__paragraph">De rubriek Nieuws wordt verzorgd door een professionele redactie. Dit is de plek waar nieuw en bestaand beleid wordt uitgelegd en vertaald naar de praktijk, waar je reportages van evenementen leest en waar je kunt reageren op een interview met een interessante onderwijsvernieuwer.</p>
                        </div>
                            <div className="col-sm-4"><img src="/mod/pleio_template/src/images/campagne-nieuws.png" className="campagne__image" />
                            <div className="campagne__image-title">Nieuws</div>
                            <p className="campagne__paragraph">We vinden het belangrijk dat alle leraren toegang hebben tot deze informatie. Daarom zijn alle nieuwsberichten, blogs en forumposts voor iedereen te raadplegen. Wil je ook zelf kunnen bloggen, een vraag kunnen stellen op het forum of op een andere manier deel uitmaken van een community? Maak dan een profiel aan!</p>
                        </div>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="buttons ___center ___margin-top">
                            <Link to="/register" className="button">
                                Aanmelden voor community
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="campagne__divider"></div>

                <section className="section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-5 col-lg-4 col-lg-offset-1 middle-sm">
                                <div className="campagne__justify">
                                    <h3 className="main__title ___less-margin-bottom">Relevant</h3>
                                    <p className="campagne__paragraph">Leraar.nl draait om relevante informatie. Zo kom je te weten wat die ene wetswijziging voor jou en je team betekent. Lees je een inspirerend blog van een leraar die net als jij worstelt met hoe je maatschappelijke kwesties in de les behandelt. Of vraag je andere leden van de community naar tips voor bijscholing.</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-sm-offset-1 middle-sm">
                                <img src="/mod/pleio_template/src/images/campagne-relevant.png" className="campagne__image ___right" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="campagne__divider"></div>

                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-sm-offset-1 middle-sm">
                                <div className="campagne__justify">
                                    <h3 className="main__title ___less-margin-bottom">Op maat</h3>
                                    <p className="campagne__paragraph">Een persoonlijk profiel heeft nog een belangrijk voordeel: als leraar heb je vaak geen tijd om gigantische hoeveelheden informatie uit te pluizen, op zoek naar dat ene stukje dat jouw vraag beantwoordt. Daarom biedt Leraar.nl zoveel mogelijk informatie op maat. Ben je geïnteresseerd in professionele ontwikkeling? Wet- en regelgeving? In het basisonderwijs of in het mbo? Je maakt een profiel aan en geeft eenvoudig je onderwijssector en interesses aan. Zo krijg je een gepersonaliseerde tijdlijn aangeboden. Dat spaart tijd en brengt je sneller tot de kern.</p>
                                </div>
                            </div>
                            <div className="first-sm col-sm-5 col middle-sm">
                                <img src="/mod/pleio_template/src/images/campagne-op-maat.png" className="campagne__image ___no-shadow ___margin-top-mobile" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="campagne__divider"></div>

                <section className="section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-8 col-lg-6 col-lg-offset-1 middle-sm">
                                <div className="campagne__justify">
                                    <h3 className="main__title ___less-margin-bottom">Testversie</h3>
                                    <p className="campagne__paragraph">Op dit moment wordt Leraar.nl nog uitgebreid getest. Dat doen we graag samen met leraren. Zo weten we zeker dat we optimaal aansluiten bij jouw belevingswereld. Zowel in beeld als in terminologie en functionaliteiten. Daarom geven we 500 leraren de kans om als een profiel aan te maken, met elkaar in gesprek te gaan en samen met de ontwikkelaars de site te verbeteren. Dat doen we in een zogenaamde afgesloten bèta-omgeving. Mis je iets of werkt iets niet helemaal goed? Neem dan gerust contact op met de redactie via het forum of<a href="mailto:leraar@minocw.nl"> leraar@minocw.nl</a>!</p>
                                </div>
                            </div>
                            <div className="col-sm-3 col-sm-offset-1 col-lg-4 col-lg-offset-1 middle-sm"><img src="/mod/pleio_template/src/images/campagne-beta.png" className="campagne__image ___no-shadow ___left ___not-tablet" /><img src="/mod/pleio_template/src/images/campagne-beta-tablet.png" className="campagne__image ___no-shadow ___left ___tablet" /></div>
                        </div>
                    </div>
                </section>

                <div className="campagne__spacer"></div>

                <section className="section ___light-blue ___center ___padding-bottom ___padding-top-mobile">
                    <div className="container">
                        <h3 className="main__title ___primary ___less-margin-bottom">Toegang tot de testversie?</h3>
                        <p className="campagne__paragraph">Schrijf je in en maak deel uit van de community</p>
                        <div className="buttons ___margin-top-extra ___center">
                            <Link to="/register" className="button ___large">
                                Aanmelden voor de community
                            </Link>
                        </div>
                    </div>
                </section>
                <VideoModal ref="videoModal" type="vimeo" id="194009767" />
            </div>
        )
    }
}