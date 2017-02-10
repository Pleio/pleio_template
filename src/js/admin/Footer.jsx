import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Footer extends React.Component {
    constructor(props) {
        super(props)

        this.addLink = this.addLink.bind(this)
        this.removeLink = this.removeLink.bind(this)

        this.state = {
            footer: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            footer: List(data.site.footer)
        })
    }

    addLink(e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.push({
                title: "Nieuwe link",
                link: "https://www.nieuw.nl"
            })
        })
    }

    onChangeField(i, fieldName, e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.set(i, Object.assign({}, this.state.footer[i], {
                [fieldName]: e.target.value
            }))
        })
    }

    removeLink(i, e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.delete(i)
        })
    }

    render() {
        const footer = this.state.footer.map((link, i) => {
            return (
                <div key={i}>
                    <input type="text" name={`footerTitle[${i}]`} onChange={(e) => this.onChangeField(i, "title", e)} value={link.title} />
                    <input type="text" name={`footerLink[${i}]`} onChange={(e) => this.onChangeField(i, "link", e)} value={link.link} />
                    <span className="elgg-icon elgg-icon-delete" onClick={(e) => this.removeLink(i, e)} />
                </div>
            )
        })

        return (
            <div>
                <div>
                    <button className="elgg-button elgg-button-submit" onClick={this.addLink}>
                        Link toevoegen
                    </button>
                    {footer}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Footer {
        site {
            guid
            footer {
                title
                link
            }
        }
    }
`

export default graphql(Query)(Footer)