(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{1627:function(t,e,n){var r=n(26),o=n(1628);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var i={insert:function(t){const e=document.getElementsByTagName("apryse-webviewer");if(e.length>0){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(0===r)o.shadowRoot.appendChild(t),t.onload=function(){n.length>0&&n.forEach(e=>{e.innerHTML=t.innerHTML})};else{const e=t.cloneNode(!0);o.shadowRoot.appendChild(e),n.push(e)}}}else document.head.appendChild(t)},singleton:!1};r(o,i);t.exports=o.locals||{}},1628:function(t,e,n){(e=t.exports=n(27)(!1)).push([t.i,".open.Model3DModal{visibility:visible}.closed.Model3DModal{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.Model3DModal{position:fixed;left:0;bottom:0;z-index:100;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:var(--modal-negative-space)}.Model3DModal .modal-container .wrapper .modal-content{padding:10px}.Model3DModal .footer{display:flex;flex-direction:row;justify-content:flex-end;width:100%;margin-top:13px}.Model3DModal .footer.modal-footer{padding:16px;margin:0;border-top:1px solid var(--divider)}.Model3DModal .footer .modal-button{display:flex;justify-content:center;align-items:center;padding:6px 18px;margin:8px 0 0;width:auto;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;border-radius:4px;height:30px;cursor:pointer}.Model3DModal .footer .modal-button.cancel{color:var(--secondary-button-text);border:1px solid var(--secondary-button-text)}.Model3DModal .footer .modal-button.cancel:hover{background-color:var(--document-background-color);color:var(--secondary-button-hover);border:1px solid var(--secondary-button-hover)}.Model3DModal .footer .modal-button.confirm{margin-left:4px;color:var(--primary-button-text);font-weight:600;background:var(--primary-button)}.Model3DModal .footer .modal-button.confirm:hover{background:var(--primary-button-hover)}.Model3DModal .footer .modal-button.confirm.disabled{background:var(--primary-button)!important;opacity:.5}.Model3DModal .footer .modal-button.secondary-btn-custom{border-radius:4px;border:1px solid var(--primary-button);color:var(--primary-button);padding:2px 20px 4px;cursor:pointer;background-color:#fff}.Model3DModal .footer .modal-button.secondary-btn-custom:hover{color:var(--secondary-button-hover)}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .Model3DModal .footer .modal-button{padding:23px 8px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .Model3DModal .footer .modal-button{padding:23px 8px}}.Model3DModal .swipe-indicator{background:var(--divider);border-radius:2px;height:4px;width:38px;position:absolute;top:12px;margin-left:auto;margin-right:auto;left:0;right:0}@media(min-width:641px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .Model3DModal .swipe-indicator{display:none}}@container (min-width: 641px){.App.is-web-component:not(.is-in-desktop-only-mode) .Model3DModal .swipe-indicator{display:none}}.Model3DModal .container{overflow-y:auto;max-height:100%}@media(max-height:500px){.App:not(.is-web-component) .Model3DModal .container,.Model3DModal .App:not(.is-web-component) .container{overflow:auto;max-height:100%}}@container (max-height: 500px){.App.is-web-component .Model3DModal .container,.Model3DModal .App.is-web-component .container{overflow:auto;max-height:100%}}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .Model3DModal .container,.Model3DModal .App:not(.is-in-desktop-only-mode):not(.is-web-component) .container{width:100%;position:fixed;left:0;bottom:0;padding-top:4px;min-width:100px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .Model3DModal .container,.Model3DModal .App.is-web-component:not(.is-in-desktop-only-mode) .container{width:100%;position:fixed;left:0;bottom:0;padding-top:4px;min-width:100px}}.Model3DModal .container{display:flex;flex-direction:column;justify-content:center;align-items:center;width:500px;border-radius:4px;padding:8px;box-shadow:0 0 3px 0 var(--document-box-shadow);background:var(--component-background)}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .Model3DModal .container{padding:24px 24px 16px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .Model3DModal .container{padding:24px 24px 16px}}.Model3DModal .container .inputWrapper>label{width:100%}.Model3DModal .container .divider{height:1px;width:100%;background:var(--divider);margin:16px 0}.Model3DModal .container input{margin-top:8px;width:100%;height:30px;border:1px solid var(--border);border-radius:4px;color:var(--text-color);padding:4px 42px 6px 8px}.Model3DModal .container input:focus{outline:none;border:1px solid var(--focus-border)}.Model3DModal .container input::-moz-placeholder{color:var(--placeholder-text)}.Model3DModal .container input:-ms-input-placeholder{color:var(--placeholder-text)}.Model3DModal .container input::placeholder{color:var(--placeholder-text)}.Model3DModal .container input::-webkit-inner-spin-button,.Model3DModal .container input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.Model3DModal .container input[type=number]{-moz-appearance:textfield}.Model3DModal .container form{width:100%}.Model3DModal .container .error{width:100%;color:red;margin:5px 0}.Model3DModal .container .Button{display:flex;justify-content:center;align-items:center;color:var(--primary-button-text);font-weight:600;padding:6px 18px;margin-top:8px;margin-left:5px;width:auto;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;background:var(--primary-button);border-radius:4px;height:30px;cursor:pointer}.Model3DModal .container .Button:hover{background:var(--primary-button-hover)}.Model3DModal .container .Button.disabled{background:var(--gray-6);border-color:var(--gray-6);cursor:not-allowed}.model-3D-btn{padding:0;border:none;background-color:transparent;border:1px solid var(--icon-color);width:162px;height:26px;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-right:8px}:host(:not([data-tabbing=true])) .model-3D-btn,html:not([data-tabbing=true]) .model-3D-btn{outline:none}.model-3D-btn img{max-width:100%;max-height:100%}.model-3D-btn.interactable:hover{background:var(--tools-overlay-button-hover)}.model-3D-btn.active,.model-3D-btn.interactable.active{background:var(--tools-overlay-button-active)}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .model-3D-btn.add-btn{width:auto;padding-left:0;width:190px;height:30px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .model-3D-btn.add-btn{width:auto;padding-left:0;width:190px;height:30px}}",""]),e.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"}},1737:function(t,e,n){"use strict";n.r(e);n(18),n(11),n(13),n(7),n(12),n(8),n(9),n(10),n(15),n(14),n(20),n(16),n(36),n(37),n(33),n(23),n(35),n(31),n(71),n(24),n(25),n(73),n(72);var r=n(0),o=n.n(r),i=n(3),a=n(2),l=n(1),c=n(6),u=(n(82),n(53),n(140),n(67),n(68),n(69),n(70),n(42),n(45),n(46),n(66),n(17)),d=n.n(u),p=n(366),s=n(21),f=n(315),m=n(185);n(1627);function h(t){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function b(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */b=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",l=o.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function u(t,e,n,o){var i=e&&e.prototype instanceof s?e:s,a=Object.create(i.prototype),l=new k(o||[]);return r(a,"_invoke",{value:D(t,n,l)}),a}function d(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=u;var p={};function s(){}function f(){}function m(){}var y={};c(y,i,(function(){return this}));var v=Object.getPrototypeOf,g=v&&v(v(S([])));g&&g!==e&&n.call(g,i)&&(y=g);var w=m.prototype=s.prototype=Object.create(y);function x(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function M(t,e){var o;r(this,"_invoke",{value:function(r,i){function a(){return new e((function(o,a){!function r(o,i,a,l){var c=d(t[o],t,i);if("throw"!==c.type){var u=c.arg,p=u.value;return p&&"object"==h(p)&&n.call(p,"__await")?e.resolve(p.__await).then((function(t){r("next",t,a,l)}),(function(t){r("throw",t,a,l)})):e.resolve(p).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,l)}))}l(c.arg)}(r,i,o,a)}))}return o=o?o.then(a,a):a()}})}function D(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return L()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var l=O(a,n);if(l){if(l===p)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=d(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===p)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function O(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,O(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),p;var o=d(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,p;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,p):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function S(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:L}}function L(){return{value:void 0,done:!0}}return f.prototype=m,r(w,"constructor",{value:m,configurable:!0}),r(m,"constructor",{value:f,configurable:!0}),f.displayName=c(m,l,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,c(t,l,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},x(M.prototype),c(M.prototype,a,(function(){return this})),t.AsyncIterator=M,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new M(u(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},x(w),c(w,l,"Generator"),c(w,i,(function(){return this})),c(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=S,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(j),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var l=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,p):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),j(n),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;j(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:S(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),p}},t}function y(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function v(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?y(Object(n),!0).forEach((function(e){g(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function g(t,e,n){return(e=function(t){var e=function(t,e){if("object"!==h(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!==h(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"===h(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function w(t,e,n,r,o,i,a){try{var l=t[i](a),c=l.value}catch(t){return void n(t)}l.done?e(c):Promise.resolve(c).then(r,o)}function x(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){w(i,r,o,a,l,"next",t)}function l(t){w(i,r,o,a,l,"throw",t)}a(void 0)}))}}function M(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,l=[],c=!0,u=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=i.call(n)).done)&&(l.push(r.value),l.length!==e);c=!0);}catch(t){u=!0,o=t}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw o}}return l}}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return D(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return D(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function D(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var O=function(t){var e=t.fileInput,n=t.urlInput,i=t.error,a=t.setError,c=t.file,u=t.setFile,h=t.url,y=t.setURL,g=t.closeModal,w=t.isDisabled,D=t.isOpen,O=M(Object(p.a)(),1)[0],E=M(Object(r.useState)("url"),2),j=E[0],k=E[1],S=M(Object(r.useState)(""),2),L=S[0],A=S[1],P=o.a.createRef(),_=o.a.createRef(),N=function t(e){var n=new window.Core.Annotations.Model3DAnnotation;n.set3DData(L),"url"===j&&n.set3DData(h,"url");var r=l.a.getZoom();n.X=e.layerX/r,n.Y=e.layerY/r,n.Width=300,n.Height=300,n.Author=l.a.getCurrentUser(),n.setPageNumber(l.a.getCurrentPage()),l.a.addAnnotations([n]),l.a.drawAnnotationsFromList([n]),l.a.removeEventListener("click",t)},I=function(t){return t.split(".").pop()},R=function(){var t=x(b().mark((function t(e){var n;return b().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),"url"!==j){t.next=13;break}if("glb"===I(h)){t.next=5;break}return a(v(v({},i),{urlError:O("Model3D.formatError")})),t.abrupt("return");case 5:return n=function(){var t=x(b().mark((function t(e){var n;return b().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=function(t){return new Promise((function(e){var n=new XMLHttpRequest;n.onload=x(b().mark((function t(){var r;return b().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(r=new FileReader).onloadend=function(){e(r.result)},t.next=4,r.readAsDataURL(n.response);case 4:case"end":return t.stop()}}),t)}))),n.open("GET",t),n.responseType="blob",n.send()}))},t.next=3,n(e);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),t.t0=A,t.next=9,n(h);case 9:t.t1=t.sent,(0,t.t0)(t.t1),t.next=17;break;case 13:if("file"!==j){t.next=17;break}if("glb"===I(c.name)){t.next=17;break}return a(v(v({},i),{urlError:O("Model3D.formatError")})),t.abrupt("return");case 17:g(),l.a.setToolMode("Pan"),l.a.getViewerElement().style.cursor="crosshair",l.a.addEventListener("click",N);case 22:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),T=d()({Modal:!0,Model3DModal:!0,open:D,closed:!D}),F=function(){var t=x(b().mark((function t(e){var n,r;return b().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return k("file"),n=e.target.files[0],u(n),r=function(t){return new Promise((function(){var e=new FileReader;e.readAsDataURL(t),e.onload=function(){return A(e.result)}}))},t.next=6,r(n);case 6:a({}),y("");case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),C=o.a.createElement("input",{className:"urlInput",type:"url",ref:n,value:h,onChange:function(t){return function(t){k("url"),y(t.trim()),a(""),e.current.value=null}(t.target.value)},onFocus:function(){return P.current.click()},placeholder:O("Model3D.enterurl")}),G=o.a.createElement("input",{type:"file",ref:e,onChange:F,accept:".glb",onFocus:function(){return _.current.click()}});return w?null:o.a.createElement(m.a,{onSwipedUp:g,onSwipedDown:g,preventDefaultTouchmoveEvent:!0},o.a.createElement("div",{className:T,"data-element":"Model3DModal",onMouseDown:g},o.a.createElement("div",{className:"container",onMouseDown:function(t){return t.stopPropagation()}},o.a.createElement("div",{className:"swipe-indicator"}),o.a.createElement("form",{onSubmit:R},o.a.createElement("div",{className:"col"},O("Model3D.enterurlOrLocalFile")),o.a.createElement(f.a,{dataElement:"3DAnnotationLink",id:"3D-annotation-link",name:"3DInput",className:"inputWrapper",ref:P,radio:!0,label:C,center:!0}),(null==i?void 0:i.urlError)&&o.a.createElement("p",{className:"error"},"* ",i.urlError),o.a.createElement(f.a,{dataElement:"3DAnnotationLocalFile",id:"3D-annotation-file",name:"3DInput",className:"inputWrapper",ref:_,radio:!0,label:G,center:!0}),(null==i?void 0:i.fileError)&&o.a.createElement("p",{className:"error"},"* ",i.fileError),o.a.createElement(s.a,{dataElement:"linkSubmitButton",label:O("action.draw"),onClick:R})))))};function E(t){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var j=["close3DModal"];function k(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function S(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?k(Object(n),!0).forEach((function(e){L(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function L(t,e,n){return(e=function(t){var e=function(t,e){if("object"!==E(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!==E(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"===E(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function A(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var P=function(t){var e=t.close3DModal,n=A(t,j),i=Object(r.useCallback)((function(){e()}),[e]),a=S(S({},n),{},{closeModal:i});return o.a.createElement(O,a)},_=n(5);function N(t){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function I(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function R(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?I(Object(n),!0).forEach((function(e){T(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function T(t,e,n){return(e=function(t){var e=function(t,e){if("object"!==N(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!==N(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"===N(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function F(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,l=[],c=!0,u=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=i.call(n)).done)&&(l.push(r.value),l.length!==e);c=!0);}catch(t){u=!0,o=t}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw o}}return l}}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return C(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return C(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function C(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var G=function(t){var e=Object(c.d)(),n=F(Object(r.useState)(""),2),u=n[0],d=n[1],p=F(Object(r.useState)({}),2),s=p[0],f=p[1],m=F(Object(r.useState)({fileError:"",urlError:""}),2),h=m[0],b=m[1],y=o.a.createRef(),v=o.a.createRef(),g=F(Object(c.e)((function(t){return[i.a.isElementDisabled(t,_.a.MODEL3D_MODAL),i.a.isElementOpen(t,_.a.MODEL3D_MODAL)]})),2),w=g[0],x=g[1];Object(r.useEffect)((function(){var t=function(){e(a.a.closeElement(_.a.MODEL3D_MODAL))};return l.a.addEventListener("toolUpdated",t),function(){return l.a.removeEventListener("toolUpdated",t)}}),[]),Object(r.useEffect)((function(){x&&(v.current.focus(),e(a.a.closeElements([_.a.PRINT_MODAL,_.a.LOADING_MODAL,_.a.PROGRESS_MODAL,_.a.ERROR_MODAL,_.a.OPEN_FILE_MODAL])))}),[e,x]);var M=R(R({},t),{},{isDisabled:w,isOpen:x,close3DModal:function(){e(a.a.closeElement(_.a.MODEL3D_MODAL)),d(""),f({}),b({}),y.current&&(y.current.value=null)},fileInput:y,urlInput:v,error:h,setError:b,file:s,setFile:f,url:u,setURL:d});return o.a.createElement(P,M)};e.default=G}}]);
//# sourceMappingURL=40.chunk.js.map