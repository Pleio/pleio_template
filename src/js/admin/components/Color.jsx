import React from "react"
import autobind from "autobind-decorator"

export default class Color extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value || "#000"
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props == nextProps) {
            return
        }

        this.setState({ value: nextProps.value })
    }

    @autobind
    onChange(e) {
        this.setState({ value: e.target.value })
    }

    render() {
        return (
            <div style={{width:"100%", clear:"both"}}>
                <div style={{width:"100px", float:"left"}}><label>{this.props.label}</label></div>
                <div style={{float:"left", border:"2px solid #efefef", width:"50px", height:"25px", backgroundColor: this.state.value}} />
                <div style={{float:"left", marginLeft: "5px"}}><input type="text" name={`params[color_${this.props.item}]`} onChange={this.onChange} value={this.state.value} /></div>
            </div>
        )
    }
}