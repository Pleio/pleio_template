webpackJsonp([1],{1149:function(e,t,n){e.exports=n(449)},449:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),a=n.n(r),i=n(36),o=n.n(i),l=n(192),u=n(1),s=(n.n(u),n(476)),c=n(477),f=n(474),p=n(475),m=new l.default;document.getElementById("pleio-template-admin-menu")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:m},a.a.createElement(s.a,null)),document.getElementById("pleio-template-admin-menu")),document.getElementById("pleio-template-admin-profile")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:m},a.a.createElement(c.a,null)),document.getElementById("pleio-template-admin-profile")),document.getElementById("pleio-template-admin-filters")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:m},a.a.createElement(f.a,null)),document.getElementById("pleio-template-admin-filters")),document.getElementById("pleio-template-admin-footer")&&o.a.render(a.a.createElement(u.ApolloProvider,{client:m},a.a.createElement(p.a,null)),document.getElementById("pleio-template-admin-footer"))},474:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=n(0),l=n.n(o),u=n(478),s=n(7),c=(n.n(s),n(1)),f=(n.n(c),n(3)),p=n.n(f),m=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=function(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n    query Filters {\n        site {\n            guid\n            filters {\n                name\n                values\n            }\n        }\n    }\n"],["\n    query Filters {\n        site {\n            guid\n            filters {\n                name\n                values\n            }\n        }\n    }\n"]),v=function(e){function t(e){r(this,t);var i=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.addFilter=i.addFilter.bind(i),i.removeFilter=i.removeFilter.bind(i),i.state={filters:n.i(s.List)()},i}return i(t,e),m(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({filters:n.i(s.List)(t.site.filters)})}},{key:"addFilter",value:function(e){e.preventDefault(),this.setState({filters:this.state.filters.push({name:"Nieuwe naam",values:n.i(s.List)()})})}},{key:"changeFilter",value:function(e,t){t.preventDefault(),this.setState({filters:this.state.filters.set(e,Object.assign({},this.state.filters[e],{name:t.target.value}))})}},{key:"removeFilter",value:function(e,t){t.preventDefault(),this.setState({filters:this.state.filters.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.filters.map(function(t,n){return l.a.createElement(u.a,{key:n,id:n,name:t.name,required:t.required,values:t.values,onChangeFilter:function(t){return e.changeFilter(n,t)},onRemove:function(t){return e.removeFilter(n,t)}})});return l.a.createElement("div",null,l.a.createElement("div",null,l.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addFilter},"Filter toevoegen")),t)}}]),t}(l.a.Component),b=p()(d);t.a=n.i(c.graphql)(b)(v)},475:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var l=n(0),u=n.n(l),s=n(7),c=(n.n(s),n(1)),f=(n.n(c),n(3)),p=n.n(f),m=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=function(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n    query Footer {\n        site {\n            guid\n            footer {\n                title\n                link\n            }\n        }\n    }\n"],["\n    query Footer {\n        site {\n            guid\n            footer {\n                title\n                link\n            }\n        }\n    }\n"]),v=function(e){function t(e){a(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.addLink=r.addLink.bind(r),r.removeLink=r.removeLink.bind(r),r.state={footer:n.i(s.List)()},r}return o(t,e),m(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({footer:n.i(s.List)(t.site.footer)})}},{key:"addLink",value:function(e){e.preventDefault(),this.setState({footer:this.state.footer.push({title:"Nieuwe link",link:"https://www.nieuw.nl"})})}},{key:"onChangeField",value:function(e,t,n){n.preventDefault(),this.setState({footer:this.state.footer.set(e,Object.assign({},this.state.footer[e],r({},t,n.target.value)))})}},{key:"removeLink",value:function(e,t){t.preventDefault(),this.setState({footer:this.state.footer.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.footer.map(function(t,n){return u.a.createElement("div",{key:n},u.a.createElement("input",{type:"text",name:"footerTitle["+n+"]",onChange:function(t){return e.onChangeField(n,"title",t)},value:t.title}),u.a.createElement("input",{type:"text",name:"footerLink["+n+"]",onChange:function(t){return e.onChangeField(n,"link",t)},value:t.link}),u.a.createElement("span",{className:"elgg-icon elgg-icon-delete",onClick:function(t){return e.removeLink(n,t)}}))});return u.a.createElement("div",null,u.a.createElement("div",null,u.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addLink},"Link toevoegen"),t))}}]),t}(u.a.Component),b=p()(d);t.a=n.i(c.graphql)(b)(v)},476:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var l=n(0),u=n.n(l),s=n(7),c=(n.n(s),n(1)),f=(n.n(c),n(3)),p=n.n(f),m=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=function(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n    query Menu {\n        site {\n            guid\n            menu {\n                title\n                link\n            }\n        }\n    }\n"],["\n    query Menu {\n        site {\n            guid\n            menu {\n                title\n                link\n            }\n        }\n    }\n"]),v=function(e){function t(e){a(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.addLink=r.addLink.bind(r),r.removeLink=r.removeLink.bind(r),r.state={menu:n.i(s.List)()},r}return o(t,e),m(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({menu:n.i(s.List)(t.site.menu)})}},{key:"addLink",value:function(e){e.preventDefault(),this.setState({menu:this.state.menu.push({title:"Nieuw",link:"/nieuw"})})}},{key:"onChangeField",value:function(e,t,n){n.preventDefault(),this.setState({menu:this.state.menu.set(e,Object.assign({},this.state.menu[e],r({},t,n.target.value)))})}},{key:"removeLink",value:function(e,t){t.preventDefault(),this.setState({menu:this.state.menu.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.menu.map(function(t,n){return u.a.createElement("div",{key:n},u.a.createElement("input",{type:"text",name:"menuTitle["+n+"]",onChange:function(t){return e.onChangeField(n,"title",t)},value:t.title}),u.a.createElement("input",{type:"text",name:"menuLink["+n+"]",onChange:function(t){return e.onChangeField(n,"link",t)},value:t.link}),u.a.createElement("span",{className:"elgg-icon elgg-icon-delete",onClick:function(t){return e.removeLink(n,t)}}))});return u.a.createElement("div",null,u.a.createElement("div",null,u.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addLink},"Link toevoegen"),t))}}]),t}(u.a.Component),b=p()(d);t.a=n.i(c.graphql)(b)(v)},477:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var l=n(0),u=n.n(l),s=n(7),c=(n.n(s),n(1)),f=(n.n(c),n(3)),p=n.n(f),m=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=function(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n    query Profile {\n        site {\n            guid\n            profile {\n                key\n                name\n            }\n        }\n    }\n"],["\n    query Profile {\n        site {\n            guid\n            profile {\n                key\n                name\n            }\n        }\n    }\n"]),v=function(e){function t(e){a(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.addField=r.addField.bind(r),r.removeField=r.removeField.bind(r),r.state={profile:n.i(s.List)()},r}return o(t,e),m(t,[{key:"componentWillReceiveProps",value:function(e){var t=e.data;t.site&&this.props.data!==e.data&&this.setState({profile:n.i(s.List)(t.site.profile)})}},{key:"addField",value:function(e){e.preventDefault(),this.setState({profile:this.state.profile.push({key:"veld",name:"Een voorbeeldveld"})})}},{key:"onChangeField",value:function(e,t,n,a){n.preventDefault();var i=n.target.value;a&&(i=i.toLowerCase().replace(/[^a-z]/gm,"")),this.setState({profile:this.state.profile.set(e,Object.assign({},this.state.profile[e],r({},t,i)))})}},{key:"removeField",value:function(e,t){t.preventDefault(),this.setState({profile:this.state.profile.delete(e)})}},{key:"render",value:function(){var e=this,t=this.state.profile.map(function(t,n){return u.a.createElement("div",{key:n},u.a.createElement("input",{type:"text",name:"profileKey["+n+"]",onChange:function(t){return e.onChangeField(n,"key",t,!0)},value:t.key}),u.a.createElement("input",{type:"text",name:"profileName["+n+"]",onChange:function(t){return e.onChangeField(n,"name",t,!1)},value:t.name}),u.a.createElement("span",{className:"elgg-icon elgg-icon-delete",onClick:function(t){return e.removeField(n,t)}}))});return u.a.createElement("div",null,u.a.createElement("div",null,u.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addField},"Veld toevoegen"),u.a.createElement("br",null),u.a.createElement("b",null,"Sleutel")," ",u.a.createElement("b",null,"Omschrijving"),u.a.createElement("br",null),u.a.createElement("i",null,"Let op: de sleutel mag alleen de karakters a-z bevatten en mag maximaal 8 tekens lang zijn."),t))}}]),t}(u.a.Component),b=p()(d);t.a=n.i(c.graphql)(b)(v)},478:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=n(0),l=n.n(o),u=n(7);n.n(u);n.d(t,"a",function(){return c});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=function(e){function t(e){r(this,t);var i=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.addValue=i.addValue.bind(i),i.removeValue=i.removeValue.bind(i),i.state={values:n.i(u.List)(i.props.values)},i}return i(t,e),s(t,[{key:"addValue",value:function(e){e.preventDefault(),this.setState({values:this.state.values.push("Nieuwe waarde")})}},{key:"changeValue",value:function(e,t){t.preventDefault(),this.setState({values:this.state.values.set(e,t.target.value)})}},{key:"removeValue",value:function(e){this.setState({values:this.state.values.remove(e)})}},{key:"render",value:function(){var e=this,t=this.state.values.map(function(t,n){return l.a.createElement("li",{key:n},l.a.createElement("input",{type:"text",name:"filterValues["+e.props.id+"][]",value:t,onChange:function(t){return e.changeValue(n,t)}}),l.a.createElement("span",{className:"elgg-icon elgg-icon-delete",title:"Verwijder",onClick:function(){return e.removeValue(n)}}))});return l.a.createElement("div",{className:"elgg-module elgg-module-inline"},l.a.createElement("div",{className:"elgg-head"},l.a.createElement("input",{type:"text",name:"filterName["+this.props.id+"]",onChange:this.props.onChangeFilter,value:this.props.name}),l.a.createElement("div",{className:"elgg-menu-title"},l.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.addValue},"Waarde toevoegen"),l.a.createElement("button",{className:"elgg-button elgg-button-submit",onClick:this.props.onRemove},"Filter verwijderen"))),l.a.createElement("div",{className:"elgg-body"},l.a.createElement("ul",null,t)))}}]),t}(l.a.Component)}},[1149]);