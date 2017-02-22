webpackJsonp([1],{394:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),a=n.n(r),i=n(28),o=n.n(i),l=n(254),u=n(2),s=(n.n(u),n(420)),c=n(421),f=new l.a;document.getElementById("pleio-template-admin-filters")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:f},a.a.createElement(s.a,null)),document.getElementById("pleio-template-admin-filters")),document.getElementById("pleio-template-admin-footer")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:f},a.a.createElement(c.a,null)),document.getElementById("pleio-template-admin-footer"))},420:function(e,t,n){"use strict";function r(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var l=n(0),u=n.n(l),s=n(422),c=n(7),f=(n.n(c),n(2)),p=(n.n(f),n(3)),m=n.n(p),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=r(["\n    query Filters {\n        site {\n            guid\n            filters {\n                name\n                values\n            }\n        }\n    }\n"],["\n    query Filters {\n        site {\n            guid\n            filters {\n                name\n                values\n            }\n        }\n    }\n"]),h=function(e){function t(e){a(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.addFilter=r.addFilter.bind(r),r.removeFilter=r.removeFilter.bind(r),r.state={filters:n.i(c.List)()},r}return o(t,e),v(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({filters:n.i(c.List)(t.site.filters)})}},{key:"addFilter",value:function(e){e.preventDefault(),this.setState({filters:this.state.filters.push({name:"Nieuwe naam",values:n.i(c.List)()})})}},{key:"changeFilter",value:function(e,t){t.preventDefault(),this.setState({filters:this.state.filters.set(e,Object.assign({},this.state.filters[e],{name:t.target.value}))})}},{key:"removeFilter",value:function(e,t){t.preventDefault(),this.setState({filters:this.state.filters.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.filters.map(function(t,n){return u.a.createElement(s.a,{key:n,id:n,name:t.name,required:t.required,values:t.values,onChangeFilter:function(t){return e.changeFilter(n,t)},onRemove:function(t){return e.removeFilter(n,t)}})});return u.a.createElement("div",null,u.a.createElement("div",null,u.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addFilter},"Filter toevoegen")),t)}}]),t}(u.a.Component),b=m()(d);t.a=n.i(f.graphql)(b)(h)},421:function(e,t,n){"use strict";function r(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(0),s=n.n(u),c=n(7),f=(n.n(c),n(2)),p=(n.n(f),n(3)),m=n.n(p),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=r(["\n    query Footer {\n        site {\n            guid\n            footer {\n                title\n                link\n            }\n        }\n    }\n"],["\n    query Footer {\n        site {\n            guid\n            footer {\n                title\n                link\n            }\n        }\n    }\n"]),h=function(e){function t(e){i(this,t);var r=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.addLink=r.addLink.bind(r),r.removeLink=r.removeLink.bind(r),r.state={footer:n.i(c.List)()},r}return l(t,e),v(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({footer:n.i(c.List)(t.site.footer)})}},{key:"addLink",value:function(e){e.preventDefault(),this.setState({footer:this.state.footer.push({title:"Nieuwe link",link:"https://www.nieuw.nl"})})}},{key:"onChangeField",value:function(e,t,n){n.preventDefault(),this.setState({footer:this.state.footer.set(e,Object.assign({},this.state.footer[e],a({},t,n.target.value)))})}},{key:"removeLink",value:function(e,t){t.preventDefault(),this.setState({footer:this.state.footer.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.footer.map(function(t,n){return s.a.createElement("div",{key:n},s.a.createElement("input",{type:"text",name:"footerTitle["+n+"]",onChange:function(t){return e.onChangeField(n,"title",t)},value:t.title}),s.a.createElement("input",{type:"text",name:"footerLink["+n+"]",onChange:function(t){return e.onChangeField(n,"link",t)},value:t.link}),s.a.createElement("span",{className:"elgg-icon elgg-icon-delete",onClick:function(t){return e.removeLink(n,t)}}))});return s.a.createElement("div",null,s.a.createElement("div",null,s.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addLink},"Link toevoegen"),t))}}]),t}(s.a.Component),b=m()(d);t.a=n.i(f.graphql)(b)(h)},422:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=n(0),l=n.n(o),u=n(7),s=(n.n(u),function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()),c=function(e){function t(e){r(this,t);var i=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.addValue=i.addValue.bind(i),i.removeValue=i.removeValue.bind(i),i.state={values:n.i(u.List)(i.props.values)},i}return i(t,e),s(t,[{key:"addValue",value:function(e){e.preventDefault(),this.setState({values:this.state.values.push("Nieuwe waarde")})}},{key:"changeValue",value:function(e,t){t.preventDefault(),this.setState({values:this.state.values.set(e,t.target.value)})}},{key:"removeValue",value:function(e){this.setState({values:this.state.values.remove(e)})}},{key:"render",value:function(){var e=this,t=this.state.values.map(function(t,n){return l.a.createElement("li",{key:n},l.a.createElement("input",{type:"text",name:"filterValues["+e.props.id+"][]",value:t,onChange:function(t){return e.changeValue(n,t)}}),l.a.createElement("span",{className:"elgg-icon elgg-icon-delete",title:"Verwijder",onClick:function(){return e.removeValue(n)}}))});return l.a.createElement("div",{className:"elgg-module elgg-module-inline"},l.a.createElement("div",{className:"elgg-head"},l.a.createElement("input",{type:"text",name:"filterName["+this.props.id+"]",onChange:this.props.onChangeFilter,value:this.props.name}),l.a.createElement("div",{className:"elgg-menu-title"},l.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addValue},"Waarde toevoegen"),l.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.props.onRemove},"Filter verwijderen"))),l.a.createElement("div",{className:"elgg-body"},l.a.createElement("ul",null,t)))}}]),t}(l.a.Component);t.a=c},947:function(e,t,n){e.exports=n(394)}},[947]);