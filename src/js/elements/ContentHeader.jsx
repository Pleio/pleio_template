import React from 'react'
import Select from './Select'

export default class ContentHeader extends React.Component {
    render() {
        let sectorOptions = {
            "primair": "Primair onderwijs",
            "voortgezet": "Voorgezet onderwijs",
            "speciaal": "Speciaal onderwijs",
            "mbo": "Mbo",
            "hbo": "Hbo",
            "wo": "WO",
            "alle": "Alle onderwijssectoren"
        }

        let categoryOptions = {
            1: "Loopbaan",
            2: "Contract & Afspraken",
            3: "Omgaan met crises",
            4: "In de klas",
            5: "Wetten en regels",
            6: "Toekomstvisies",
            7: "Overig",
            8: "Mijn categorieën",
            9: "Alle categorieën"
        }

        return (
            <section className="section">
                <div className="container">
                    <h3 className="main__title">Nieuws</h3>
                    <div className="row">
                        <div className="col-sm-4 col-lg-3">
                            <Select name="sectorFilter" options={sectorOptions} value="primair" />
                        </div>
                        <div className="col-sm-4 col-lg-3">
                            <Select name="categoryFilter" options={categoryOptions} value={1} />
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}