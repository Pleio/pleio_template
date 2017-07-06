import React from "react"
import autobind from "autobind-decorator"

export default class Tabber extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            slide: 0
        }
    }

    @autobind
    toggleSlide(e, i) {
        e.preventDefault()
        this.setState({ slide: i })
    }

    render() {
        const menu = this.props.items.map((item, i) => (
            <div key={i} className="tabmenu__link" onClick={(e) => this.toggleSlide(e, i)}>
                {item.title}
            </div>
        ))

        const slides = this.props.items.map((item, i) => (
            <div key={i} className="tabber__slide">
                {item.content}
            </div>
        ))

        return (
            <div className="tabber">
                <div className="tabmenu">
                    {menu}
                </div>
                <div className="tabber__slides" style={{width: "200%", transform: "translateX(0%)"}}>
                    {slides}
                </div>
            </div>
        )
    }
}