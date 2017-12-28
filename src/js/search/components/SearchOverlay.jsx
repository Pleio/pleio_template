import React from "react"
import AutocompleteList from "../containers/AutocompleteList"

const subtypes = [{title:"Blog", subtype:"blog"}, {title:"Vragen", subtype:"question"}, {title:"Nieuws", subtype:"news"}]

class SearchOverlay extends React.Component {
    render() {
        let autocompleteLists

        if (this.props.q) {
            autocompleteLists = subtypes.map((subtype, i) => (
                <AutocompleteList key={i} q={this.props.q} type="object" title={subtype.title} subtype={subtype.subtype} />
            ))
        }

        return (
            <div id="searchResults" tabIndex="0" className="navigation-search-results ___small-header">
                <div className="container">
                    <div className="row">
                        {autocompleteLists}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchOverlay