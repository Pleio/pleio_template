import React from 'react'

export default class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            value: this.props.value
        }

        this.onSelect = this.onSelect.bind(this)
        this.onToggle = this.onToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    onToggle(e) {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    onSelect(e, value) {
        if (value) {
            this.setState({
                value
            })
        }

        this.setState({
            isOpen: false
        })
    }

    render() {
        let options = {};
        if (this.props.options) {
            options = this.props.options;
        }

        let ulOptions = Object.keys(options).map(option => (
            <li key={option} className="selector__option" onClick={(e) => this.onSelect(e, option)}>
                {options[option]}
            </li>
        ))

        let selected = "Maak een keuze"
        if (this.state.value) {
            selected = options[this.state.value]
        }

        let isOpenClass = ""
        if (this.state.isOpen) {
            isOpenClass = "___is-open"
        }

        return (
            <div className="selector-container ___mobile-margin-bottom">
                <label htmlFor="sectorFilter" className="selector__label">Sector</label>
                <div className={"selector " + isOpenClass}>
                    <div className="selector__select" tabIndex="0" onClick={this.onToggle}>
                        {selected}
                    </div>
                    <ul className="selector__options">
                        <li className="selector__option ___is-disabled" data-value="" onClick={this.onSelect}>
                            Maak een keuze
                        </li>
                        {ulOptions}
                    </ul>
                </div>
            </div>
        )
    }
}