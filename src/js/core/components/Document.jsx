import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Document extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: this.props.title
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title
        })
    }

    render() {
        const { site } = this.props.data
        let title = ""

        if (this.state.title) {
            title += this.state.title
        }

        if (site) {
            title += " · "
            title += site.name
        }

        if (document.title !== title) {
            document.title = title
        }

        return null
    }
}

const Query = gql`
    query Document {
        site {
            guid
            name
        }
    }
`;

export default graphql(Query)(Document)