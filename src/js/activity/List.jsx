import React from 'react'
import ContentHeader from "../core/components/ContentHeader"
import Lead from "./components/Lead"

export default class Activity extends React.Component {
    render() {
        return (
            <section className="section ___less-padding-top">
                <div className="container">
                    <Lead title="Leraar.nl" image="/mod/pleio_template/src/content/lead-1.jpg" />
                    <ContentHeader title="Laatste activiteit" />
                </div>
            </section>
        )
    }
}