/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[7],{519:function(wa,ta,n){n.r(ta);var pa=n(0),oa=n(3),na=n(176);wa=n(112);var ja=n(293);n=n(438);var ka=window;wa=function(fa){function y(x,f,e){f=fa.call(this,x,f,e)||this;if(x.name&&"xod"!==x.name.toLowerCase().split(".").pop())throw Error("Not an XOD file");if(!ka.FileReader||!ka.File||!ka.Blob)throw Error("File API is not supported in this browser");f.file=x;f.jF=[];f.$M=0;return f}Object(pa.c)(y,fa);y.prototype.rQ=function(x,
f,e){var a=this,b=new FileReader;b.onloadend=function(h){if(0<a.jF.length){var r=a.jF.shift();r.gva.readAsBinaryString(r.file)}else a.$M--;if(b.error){h=b.error;if(h.code===h.ABORT_ERR){Object(oa.j)("Request for chunk "+f.start+"-"+f.stop+" was aborted");return}return e(h)}if(h=b.content||h.target.result)return e(!1,h);Object(oa.j)("No data was returned from FileReader.")};f&&(x=(x.slice||x.webkitSlice||x.mozSlice||x.eEa).call(x,f.start,f.stop));0===a.jF.length&&50>a.$M?(b.readAsBinaryString(x),a.$M++):
a.jF.push({gva:b,file:x});return function(){b.abort()}};y.prototype.bw=function(x){var f=this;f.fF=!0;var e=na.a;f.rQ(f.file,{start:-e,stop:f.file.size},function(a,b){if(a)return Object(oa.j)("Error loading end header: %s "+a),x(a);if(b.length!==e)throw Error("Zip end header data is wrong size!");f.ie=new ja.a(b);var h=f.ie.t0();f.rQ(f.file,h,function(r,w){if(r)return Object(oa.j)("Error loading central directory: %s "+r),x(r);if(w.length!==h.stop-h.start)throw Error("Zip central directory data is wrong size!");
f.ie.H5(w);f.FM=!0;f.fF=!1;return x(!1)})})};y.prototype.wR=function(x,f){var e=this,a=e.ni[x];if(e.ie.hZ(x)){var b=e.ie.Oz(x),h=e.rQ(e.file,b,function(r,w){delete e.ni[x];if(r)return Object(oa.j)('Error loading part "%s": %s, '+x+", "+r),f(r);if(w.length!==b.stop-b.start)throw Error("Part data is wrong size!");f(!1,x,w,e.ie.z2(x))});a.t8=!0;a.cancel=h}else f(Error('File not found: "'+x+'"'),x)};return y}(wa.a);Object(n.a)(wa);Object(n.b)(wa);ta["default"]=wa}}]);}).call(this || window)
