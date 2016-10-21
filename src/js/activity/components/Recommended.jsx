import React from "react"
import classnames from "classnames"
import Accordeon from "../../core/components/Accordeon"

export default class Recommended extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggleOpen = (e) => this.setState({isOpen: !this.state.isOpen})
        this.calculateHeight = this.calculateHeight.bind(this)
    }

    calculateHeight() {
        if (this.state.isOpen) {
            return this.refs["recommendedItems"].firstChild.offsetHeight;
        }

        return 0
    }

    render() {
        return (
            <div className="col-sm-6 col-lg-12">
                <Accordeon title="Aanbevonden" className="card-list-recommended">
                    <a href="#" className="card-list-recommended__item">
                        <div style={{backgroundImage: "url(/mod/pleio_template/src/content/sarah.jpg)"}} className="card-list-recommended__picture" />
                        <div className="card-list-recommended__justify">
                            <div className="card-list-recommended__article">Titel hier die over twee regels kan lopen</div>
                            <div className="card-list-recommended__name">Ester de Jong</div>
                        </div>
                    </a>
                </Accordeon>
            </div>
        )
    }
}