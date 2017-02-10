import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Footer extends React.Component {
    render() {
        const { site } = this.props.data

        if (!site) {
            return (
                <div />
            )
        }

        const footer = site.footer.map((item, i) => (
            <a key={i} href={item.link} title={item.title} className="footer__link">
                {item.title}
            </a>
        ))

        return (
            <div className="col-sm-6 col-lg-12">
                <div className="footer">
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