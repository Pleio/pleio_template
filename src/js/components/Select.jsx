import React from 'react'
import classNames from 'classnames'

export default class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            value: this.props.value ? this.props.value : this.props.defaultValue
        }

        this.onSelect = this.onSelect.bind(this)
        this.onToggle = this.onToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let nextValue;

        if (nextProps.value !== null) {
            nextValue = nextProps.value
        } else {
            nextValue = nextProps.defaultValue
        }

        this.setState({
            value: nextValue
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.value != this.state.value) {
            if (this.props.onChange) {
                this.props.onChange(this.props.name, nextState.value)
            }
        }
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
            <li key={option} className={classNames({"selector__option": true, "___is-selected": option == this.state.value})} onClick={(e) => this.onSelect(e, option)}>
                {options[option]}
            </li>
        ))

        let selected = "Maak een keuze"
        if (this.state.value !== null) {
            selected = options[this.state.value]
        }

        return (
            <div className={classNames({"selector-container":true, "___mobile-margin-bottom":true})}>
                <label htmlFor="sectorFilter" className="selector__label">Sector</label>
                <div className={classNames({"selector": true, "___is-open": this.state.isOpen})}>
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