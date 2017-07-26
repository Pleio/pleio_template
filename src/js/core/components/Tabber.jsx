import React from "react"
import autobind from "autobind-decorator"
import classnames from "classnames"

export default class Tabber extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            slide: 0
        }
    }

    @autobind
    toggleSlide(i) {
        this.setState({ slide: i })
    }

    render() {
        const menu = this.props.items.map((item, i) => (
            <div key={i} className={classnames({"tabmenu__link": true, "___is-active": this.state.slide === i})} onClick={(e) => this.toggleSlide(i)}>
                {item.title}
            </div>
        ))

        const slides = this.props.items.map((item, i) => (
            <div key={i} className={classnames({"tabber__slide": true, "___is-active": this.state.slide === i})}>
                {item.content}
            </div>
        ))

        return (
            <div className="tabber">
                <div className="tabmenu">
                    {menu}
                </div>
                <div className="tabber__slides" style={{width: `${this.props.items.length * 100}%`, transform: `translateX(-${(this.state.slide / this.props.items.length)*100}%)`}}>
                    {slides}
                </div>
            </div>
        )
    }
}