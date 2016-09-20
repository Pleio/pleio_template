import React from 'react'
import ContentHeader from "../elements/ContentHeader"
import Lead from "../elements/Lead"

export default class Activity extends React.Component {
    render() {
        return (
            <div>
                <Lead title="Leraar.nl" image="/mod/pleio_template/src/content/lead-1.jpg" />
                <ContentHeader title="Laatste activiteit" />
            </div>
        )
    }
}