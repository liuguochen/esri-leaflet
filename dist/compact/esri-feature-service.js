/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-04-30
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
L.esri={VERSION:"0.0.1-beta.5",Layers:{},Services:{},Util:{},Support:{CORS:!!(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),pointerEvents:""===document.documentElement.style.pointerEvents}},function(L){function a(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function b(a){var b,c=0,d=0,e=a.length,f=a[d];for(d;e-1>d;d++)b=a[d+1],c+=(b[0]-f[0])*(b[1]+f[1]),f=b;return c>=0}function c(a,b,c,d){var e=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]),f=(b[0]-a[0])*(a[1]-c[1])-(b[1]-a[1])*(a[0]-c[0]),g=(d[1]-c[1])*(b[0]-a[0])-(d[0]-c[0])*(b[1]-a[1]);if(0!==g){var h=e/g,i=f/g;if(h>=0&&1>=h&&i>=0&&1>=i)return!0}return!1}function d(a,b){for(var d=0;d<a.length-1;d++)for(var e=0;e<b.length-1;e++)if(c(a[d],a[d+1],b[e],b[e+1]))return!0;return!1}function e(a,b){for(var c=!1,d=-1,e=a.length,f=e-1;++d<e;f=d)(a[d][1]<=b[1]&&b[1]<a[f][1]||a[f][1]<=b[1]&&b[1]<a[d][1])&&b[0]<(a[f][0]-a[d][0])*(b[1]-a[d][1])/(a[f][1]-a[d][1])+a[d][0]&&(c=!c);return c}function f(a,b){var c=d(a,b),f=e(a,b[0]);return!c&&f?!0:!1}function g(a){for(var c=[],d=[],e=0;e<a.length;e++){var g=a[e].slice(0);if(b(g)){var h=[g];c.push(h)}else d.push(g)}for(;d.length;){for(var i=d.pop(),j=!1,k=c.length-1;k>=0;k--){var l=c[k][0];if(f(l,i)){c[k].push(i),j=!0;break}}j||c.push([i.reverse()])}return 1===c.length?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}function h(a){var c=[],d=a.slice(0),e=d.shift().slice(0);b(e)||e.reverse(),c.push(e);for(var f=0;f<d.length;f++){var g=d[f].slice(0);b(g)&&g.reverse(),c.push(g)}return c}function i(a){for(var b=[],c=0;c<a.length;c++)for(var d=h(a[c]),e=d.length-1;e>=0;e--){var f=d[e].slice(0);b.push(f)}return b}L.esri.Util.debounce=function(a,b){var c=null;return function(){var d=this||d,e=arguments;clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},L.esri.Util.roundAwayFromZero=function(a){return a>0?Math.ceil(a):Math.floor(a)},L.esri.Util.trim=function(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")},L.esri.Util.cleanUrl=function(a){return a=L.esri.Util.trim(a),"/"!==a[a.length-1]&&(a+="/"),a},L.esri.Util.serialize=function(a){var b="";for(var c in a)if(a.hasOwnProperty(c)){var d=c,e=a[c];b+=encodeURIComponent(d),b+="=",b+=encodeURIComponent(e),b+="&"}return b.substring(0,b.length-1)},L.esri.Util.indexOf=function(a,b,c){if(c=c||0,a.indexOf)return a.indexOf(b,c);for(var d=c,e=a.length;e>d;d++)if(a[d]===b)return d;return-1},L.esri.Util.extentToBounds=function(a){var b=new L.LatLng(a.ymin,a.xmin),c=new L.LatLng(a.ymax,a.xmax);return new L.LatLngBounds(b,c)},L.esri.Util.mercatorExtentToBounds=function(a,b){var c=b.unproject(L.point([a.ymin,a.xmin])),d=b.unproject(L.point([a.ymax,a.xmax]));return new L.LatLngBounds(c,d)},L.esri.Util.boundsToExtent=function(a){return{xmin:a.getSouthWest().lng,ymin:a.getSouthWest().lat,xmax:a.getNorthEast().lng,ymax:a.getNorthEast().lat,spatialReference:{wkid:4326}}},L.esri.Util.boundsToEnvelope=function(a){var b=L.esri.Util.boundsToExtent(a);return{x:b.xmin,y:b.ymin,w:Math.abs(b.xmin-b.xmax),h:Math.abs(b.ymin-b.ymax)}},L.esri.Util.arcgisToGeojson=function(b,c){var d={};return c=c||{},c.idAttribute=c.idAttribute||void 0,b.x&&b.y&&(d.type="Point",d.coordinates=[b.x,b.y]),b.points&&(d.type="MultiPoint",d.coordinates=b.points.slice(0)),b.paths&&(1===b.paths.length?(d.type="LineString",d.coordinates=b.paths[0].slice(0)):(d.type="MultiLineString",d.coordinates=b.paths.slice(0))),b.rings&&(d=g(b.rings.slice(0))),(b.geometry||b.attributes)&&(d.type="Feature",d.geometry=b.geometry?L.esri.Util.arcgisToGeojson(b.geometry):null,d.properties=b.attributes?a(b.attributes):null,b.attributes&&(d.id=b.attributes[c.idAttribute]||b.attributes.OBJECTID||b.attributes.FID)),d},L.esri.Util.geojsonToArcGIS=function(a,b){var c,d=b&&b.idAttribute?b.idAttribute:"OBJECTID",e=b&&b.sr?{wkid:b.sr}:{wkid:4326},f={};switch(a.type){case"Point":f.x=a.coordinates[0],f.y=a.coordinates[1],f.spatialReference=e;break;case"MultiPoint":f.points=a.coordinates.slice(0),f.spatialReference=e;break;case"LineString":f.paths=[a.coordinates.slice(0)],f.spatialReference=e;break;case"MultiLineString":f.paths=a.coordinates.slice(0),f.spatialReference=e;break;case"Polygon":f.rings=h(a.coordinates.slice(0)),f.spatialReference=e;break;case"MultiPolygon":f.rings=i(a.coordinates.slice(0)),f.spatialReference=e;break;case"Feature":a.geometry&&(f.geometry=L.esri.Util.geojsonToArcGIS(a.geometry,b)),f.attributes=a.properties?L.esri.Util.clone(a.properties):{},f.attributes[d]=a.id;break;case"FeatureCollection":for(f=[],c=0;c<a.features.length;c++)f.push(L.esri.Util.geojsonToArcGIS(a.features[c],b));break;case"GeometryCollection":for(f=[],c=0;c<a.geometries.length;c++)f.push(L.esri.Util.geojsonToArcGIS(a.geometries[c],b))}return f},L.esri.Util.featureSetToFeatureCollection=function(a){var b;if(a.objectIdFieldName)b=a.objectIdFieldName;else if(a.fields)for(var c=0;c<=a.fields.length-1;c++)if("esriFieldTypeOID"===a.fields[c].type){b=a.fields[c].name;break}var d={type:"FeatureCollection",features:[]};if(a.features.length)for(var e=a.features.length-1;e>=0;e--)d.features.push(L.esri.Util.arcgisToGeojson(a.features[e],{idAttribute:b}));return d}}(L),function(L){function a(a,b){var c=new XMLHttpRequest;return c.onreadystatechange=function(){var d,e;if(4===c.readyState){try{d=JSON.parse(c.responseText)}catch(f){d=null,e={error:"Could not parse response as JSON.",code:500}}!e&&d.error&&(e=d.error,d=null),a.call(b,e,d)}},c}L.esri.RequestHandlers={post:function(b,c,d,e){c.f="json";var f=a(d,e);f.open("POST",b),f.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),f.send(L.esri.Util.serialize(c))},get:{CORS:function(b,c,d,e){c.f="json";var f=a(d,e);f.open("GET",b+"?"+L.esri.Util.serialize(c),!0),f.send(null)},JSONP:function(a,b,c,d){L.esri._callback=L.esri._callback||{};var e="c"+(1e9*Math.random()).toString(36).replace(".","_");b.f="json",b.callback="L.esri._callback."+e;var f=L.DomUtil.create("script",null,document.body);f.type="text/javascript",f.src=a+"?"+L.esri.Util.serialize(b),f.id=e,L.esri._callback[e]=function(a){var b,g=Object.prototype.toString.call(a);"[object Object]"!==g&&"[object Array]"!==g&&(b={code:500,error:"Expected array or object as JSONP response"},a=null),!b&&a.error&&(b=a.error,a=null),c.call(d,b,a),document.body.removeChild(f),delete L.esri._callback[e]}}}},L.esri.get=L.esri.Support.CORS?L.esri.RequestHandlers.get.CORS:L.esri.RequestHandlers.get.JSONP,L.esri.post=L.esri.RequestHandlers.post}(L),L.esri.Services.FeatureServer=L.esri.Service.extend({query:function(){return new L.esri.Services.Query(this)}}),L.esri.Services.featureService=function(a,b){return new L.esri.Services.FeatureService(a,b)},L.esri.Services.FeatureLayer=L.esri.Service.extend({query:function(){return new L.esri.Services.Query(this)},addFeature:function(a,b,c){a=L.esri.Util.geojsonToArcGIS(a),this.post(this.url+"addFeatures",JSON.stringify(a),b,c)},updateFeature:function(a,b,c){a=L.esri.Util.geojsonToArcGIS(a),this.post(this.url+"updateFeatures",JSON.stringify(a),b,c)},deleteFeature:function(a,b,c){this.post(this.url+"deleteFeatures",{objectIds:a},b,c)}}),L.esri.Services.featureLayer=function(a,b){return new L.esri.Services.FeatureLayer(a,b)},L.esri.Services.Query=L.Class.extend({initialize:function(a,b){a.url&&a.get?(this._service=a,this.url=a.url):this.url=a,this._params={outSr:4326};for(var c in b)b.hasOwnProperty(c)&&b.key&&this[c].apply(this,b[c])},within:function(a){return this._params.geometry=JSON.stringify(L.esri.Util.boundsToExtent(a)),this._params.geometryType="esriGeometryEnvelope",this._params.spatialRel="esriSpatialRelIntersects",this},intersects:function(a){return this._params.geometry=JSON.stringify(L.esri.Util.geojsonToArcGIS(a.toGeoJSON())),this._params.geometryType="esriGeometryPolyline",this._params.spatialRel="esriSpatialRelIntersects",this},around:function(a,b){return this._params.geometry=[a.lng,a.lat].join(","),this._params.geometryType="esriGeometryPoint",this._params.spatialRel="esriSpatialRelIntersects",this._params.units="esriSRUnit_Meter",this._params.distance=b,this._params.inSr=4326,this},layerDef:function(a,b){return this._params.layerDefs=this._params.layerDefs?this._params.layerDefs+";":"",this._params.layerDefs+=[a,b].join(":"),this},where:function(a){return this._params.where=a,this},offset:function(a){return this._params.offset=a,this},limit:function(a){return this._params.limit=a,this},between:function(a,b){return this._params.time=[a.valueOf(),b.valueOf()].join(),this},fields:function(a){return this._params.outFields=a.join(","),this},precision:function(a){return this._params.geometryPrecision=a,this},simplify:function(a,b){var c=Math.abs(a.getBounds().getWest()-a.getBounds().getEast());return this._params.maxAllowableOffset=c/a.getSize().y*b,this},orderBy:function(a,b){return this._params.orderByFields=this._params.orderByFields?this._params.orderByFields+",":"",this._params.orderByFields+=[a,b||"ASC"].join(","),this},featureIds:function(a){return this._params.objectIds=a.join(","),this},token:function(a){return this._params.token=a,this},run:function(a,b){this._request(function(c,d){d=c?null:L.esri.Util.featureSetToFeatureCollection(d),a.call(b,c,d)},b)},count:function(a,b){this._params.returnCountOnly=!0,this._request(a,b)},ids:function(a,b){this._params.returnIdsOnly=!0,this._request(a,b)},bounds:function(a,b){this._params.returnExtentOnly=!0,this._request(a,b)},_request:function(a,b){this._service?this._service.get("query",this._params,a,b):L.esri.get(this.url,this._params,a,b)}}),L.esri.Services.query=function(a,b){return new L.esri.Services.Query(a,b)},L.esri.FeatureGrid=L.Layer.extend({options:{cellSize:512,updateInterval:150},initialize:function(a){a=L.setOptions(this,a)},onAdd:function(){this._update=L.Util.throttle(this._update,this.options.updateInterval,this),this._reset(),this._update()},onRemove:function(){this._removeCells()},getEvents:function(){var a={viewreset:this._reset,moveend:this._update};return a},_reset:function(){this._removeCells(),this._cells={},this._activeCells={},this._cellsToLoad=0,this._cellsTotal=0,this._cellNumBounds=this._getCellNumBounds(),this._resetWrap()},_resetWrap:function(){var a=this._map,b=a.options.crs;if(!b.infinite){var c=this._getCellSize();b.wrapLng&&(this._wrapLng=[Math.floor(a.project([0,b.wrapLng[0]]).x/c),Math.ceil(a.project([0,b.wrapLng[1]]).x/c)]),b.wrapLat&&(this._wrapLat=[Math.floor(a.project([b.wrapLat[0],0]).y/c),Math.ceil(a.project([b.wrapLat[1],0]).y/c)])}},_getCellSize:function(){return this.options.cellSize},_update:function(){if(this._map){var a=this._map.getPixelBounds(),b=this._map.getZoom(),c=this._getCellSize();if(!(b>this.options.maxZoom||b<this.options.minZoom)){var d=L.bounds(a.min.divideBy(c).floor(),a.max.divideBy(c).floor());this._addCells(d),this._removeOtherCells(d)}}},_addCells:function(a){var b,c,d,e=[],f=a.getCenter(),g=this._map.getZoom();for(b=a.min.y;b<=a.max.y;b++)for(c=a.min.x;c<=a.max.x;c++)d=new L.Point(c,b),d.z=g,this._isValidCell(d)&&e.push(d);var h=e.length;if(0!==h)for(this._cellsToLoad+=h,this._cellsTotal+=h,e.sort(function(a,b){return a.distanceTo(f)-b.distanceTo(f)}),c=0;h>c;c++)this._addCell(e[c])},_isValidCell:function(a){var b=this._map.options.crs;if(!b.infinite){var c=this._cellNumBounds;if(!b.wrapLng&&(a.x<c.min.x||a.x>c.max.x)||!b.wrapLat&&(a.y<c.min.y||a.y>c.max.y))return!1}if(!this.options.bounds)return!0;var d=this._cellCoordsToBounds(a);return L.latLngBounds(this.options.bounds).intersects(d)},_cellCoordsToBounds:function(a){var b=this._map,c=this.options.cellSize,d=a.multiplyBy(c),e=d.add([c,c]),f=b.wrapLatLng(b.unproject(d,a.z)),g=b.wrapLatLng(b.unproject(e,a.z));return new L.LatLngBounds(f,g)},_cellCoordsToKey:function(a){return a.x+":"+a.y},_keyToCellCoords:function(a){var b=a.split(":"),c=parseInt(b[0],10),d=parseInt(b[1],10);return new L.Point(c,d)},_removeOtherCells:function(a){for(var b in this._cells)a.contains(this._keyToCellCoords(b))||this._removeCell(b)},_removeCell:function(a){var b=this._activeCells[a];b&&(delete this._activeCells[a],this.cellLeave&&this.cellLeave(b.bounds,b.coords),this.fire("cellleave",{bounds:b.bounds,coords:b.coords}))},_removeCells:function(){for(var a in this._cells){var b=this._cells[a].bounds,c=this._cells[a].coords;this.cellLeave&&this.cellLeave(b,c),this.fire("cellleave",{bounds:b,coords:c})}},_addCell:function(a){this._wrapCoords(a);var b=this._cellCoordsToKey(a),c=this._cells[b];c&&!this._activeCells[b]&&(this.cellEnter&&this.cellEnter(c.bounds,a),this.fire("cellenter",{bounds:c.bounds,coords:a}),this._activeCells[b]=c),c||(c={coords:a,bounds:this._cellCoordsToBounds(a)},this._cells[b]=c,this._activeCells[b]=c,this.createCell&&this.createCell(c.bounds,a),this.fire("cellcreate",{bounds:c.bounds,coords:a}))},_wrapCoords:function(a){a.x=this._wrapLng?L.Util.wrapNum(a.x,this._wrapLng):a.x,a.y=this._wrapLat?L.Util.wrapNum(a.y,this._wrapLat):a.y},_getCellNumBounds:function(){var a=this._map.getPixelWorldBounds(),b=this._getCellSize();return a?L.bounds(a.min.divideBy(b).floor(),a.max.divideBy(b).ceil().subtract([1,1])):null}}),L.esri.featureGrid=function(a){return new L.esri.FeatureGrid(a)},function(L){function a(a){this.values=a||[]}L.esri.FeatureManager=L.esri.FeatureGrid.extend({options:{where:"1=1",fields:["*"],from:!1,to:!1,timeField:!1,timeFilterMode:"server",simplifyFactor:0},initialize:function(b,c){L.esri.FeatureGrid.prototype.initialize.call(this,c),c=L.setOptions(this,c),this.url=L.esri.Util.cleanUrl(b),this._timeEnabled=!(!c.from||!c.to),this._service=new L.esri.Services.FeatureLayer(this.url),this._timeEnabled&&(this.timeIndex=new a),this._cache={},this._currentSnapshot=[],this._activeRequests=0},onAdd:function(){L.esri.FeatureGrid.prototype.onAdd.call(this)},onRemove:function(){L.esri.FeatureGrid.prototype.onRemove.call(this)},createCell:function(a,b){this._requestFeatures(a,b)},_requestFeatures:function(a,b,c){this._activeRequests++,1===this._activeRequests&&this.fire("loading",{bounds:a}),this._buildQuery(a).run(function(d,e){this._activeRequests--,!d&&e.features.length&&this._addFeatures(e.features,b),c&&c.call(this,d,e),this._activeRequests<=0&&this.fire("load",{bounds:a})},this)},_addFeatures:function(a,b){this._cache[b]=this._cache[b]||[];for(var c=a.length-1;c>=0;c--){var d=a[c].id;this._cache[b].push(d),this._currentSnapshot.push(d)}this._timeEnabled&&this._buildTimeIndexes(a),this.createLayers(a)},_buildQuery:function(a){var b=this._service.query().within(a).where(this.options.where).fields(this.options.fields);return this.options.simplifyFactor&&b.simplify(this._map,this.options.simplifyFactor),"server"===this.options.timeFilterMode&&this.options.from&&this.options.to&&b.between(this.options.from,this.options.to),b},setWhere:function(a,b){this.options.where=a&&a.length?a:"1=1";for(var c=[],d=[],e=0,f=L.Util.bind(function(a,f){if(f)for(var g=f.features.length-1;g>=0;g--)d.push(f.features[g].id);if(e--,0>=e){var h=this._diffLayerState(c,d);this._currentSnapshot=h.newFeatures,this.removeLayers(h.oldFeatures),this.addLayers(h.newFeatures),b&&b.call(this)}},this),g=this._currentSnapshot.length-1;g>=0;g--)c.push(this._currentSnapshot[g]);for(var h in this._activeCells){e++;var i=this._keyToCellCoords(h),j=this._cellCoordsToBounds(i);this._requestFeatures(j,h,f)}},getWhere:function(){return this.options.where},getTimeRange:function(){return[this.options.from,this.options.to]},setTimeRange:function(a,b){var c=this.options.from,d=this.options.to,e=L.Util.bind(function(){this._filterExistingFeatures(c,d,a,b)},this);if(this.options.from=a,this.options.to=b,this._filterExistingFeatures(c,d,a,b),"server"===this.options.timeFilterMode)for(var f in this._activeCells){var g=this._keyToCellCoords(f),h=this._cellCoordsToBounds(g);this._requestFeatures(h,f,e)}},_diffLayerState:function(a,b){for(var c=[],d=a.length-1;d>=0;d--){var e=b.indexOf(a[d]);e>=0&&c.push(e)}for(d=c.length-1;d>=0;d--)a.splice(c[d],1),b.splice(c[d],1);return{oldFeatures:a,newFeatures:b}},_filterExistingFeatures:function(a,b,c,d){var e=this._getFeaturesInTimeRange(a,b),f=this._getFeaturesInTimeRange(c,d),g=this._diffLayerState(e,f);this._currentSnapshot=g.newFeatures,this.removeLayers(g.oldFeatures),this.addLayers(g.newFeatures)},_getFeaturesInTimeRange:function(a,b){var c,d=[];if(this.options.timeField.start&&this.options.timeField.end){var e=this.timeIndex.between(a,b,this.options.timeField.start),f=this.timeIndex.between(a,b,this.options.timeField.end);c=e.concat(f)}else c=this.timeIndex.between(a,b,this.options.timeField);for(var g=c.length-1;g>=0;g--)d.push(c[g].id);return d},_buildTimeIndexes:function(a){for(var b=[],c=a.length-1;c>=0;c--)b.push(this._createTimeEntry(a[c]));this.timeIndex.add(b)},_createTimeEntry:function(a){var b={id:a.id};return this.options.timeField.start&&this.options.timeField.end?(b.start=new Date(a.properties[this.options.timeField.start]),b.end=new Date(a.properties[this.options.timeField.end])):b.date=new Date(a.properties[this.options.timeField]),b},_featureWithinTimeRange:function(a){if(!this.options.timeField||!this.options.from||!this.options.to)return!0;var b=this.options.from.valueOf(),c=this.options.to.valueOf();if("string"==typeof this.options.timeField){var d=a.properties[this.options.timeField];return d>b&&c>d}if(this.options.timeField.from&&this.options.timeField.to){var e=a.properties[this.options.timeField.from],f=a.properties[this.options.timeField.to];return e>b&&c>e||f>b&&c>f}}}),L.esri.featureManager=function(a){return new L.esri.FeatureManager(a)},a.prototype._query=function(a,b){"[object Date]"===Object.prototype.toString.call(b)&&(b=b.valueOf());for(var c,d,e,f=0,g=this.values.length-1;g>=f;)if(e=c=(f+g)/2||0,d=this.values[c],d[a]<b)f=c+1;else{if(!(d[a]>b))return c;g=c-1}return Math.abs(g)},a.prototype.query=function(a,b){return this.sortOn(a),this._query(a,b)},a.prototype.sortOn=function(a){this.lastKey!==a&&(this.lastKey=a,this.values.sort(function(b,c){return b[a]-c[a]}))},a.prototype.between=function(a,b,c){this.sortOn(c);var d=this._query(c,a),e=this._query(c,b);return this.values.slice(d,e)},a.prototype.add=function(a){this.values=this.values.concat(a)}}(L),L.esri.FeatureLayer=L.esri.FeatureManager.extend({initialize:function(a,b){L.esri.FeatureManager.prototype.initialize.call(this,a,b),b=L.setOptions(this,b),this._layers={}},createLayers:function(a){for(var b=a.length-1;b>=0;b--){var c,d=a[b],e=this._layers[d.id];e&&!this._map.hasLayer(e)&&this._map.addLayer(e),e&&e.setLatLngs&&(c=L.GeoJSON.geometryToLayer(d,this.options),e.setLatLngs(c.getLatLngs())),e||(c=L.GeoJSON.geometryToLayer(d,this.options),c.feature=L.GeoJSON.asFeature(d),c.defaultOptions=c.options,this.resetStyle(c),c.addEventParent(this),this._popup&&c.bindPopup(this._popup(c.feature,c)),this._layers[c.feature.id]=c,(!this._timeEnabled||this._timeEnabled&&this._featureWithinTimeRange(d))&&this._map.addLayer(c))}},cellEnter:function(a,b){var c=this._cellCoordsToKey(b),d=this._cache[c];if(d)for(var e=d.length-1;e>=0;e--){var f=d[e];this._map.hasLayer(f)||this._map.addLayer(f)}},cellLeave:function(a,b){var c=this._cellCoordsToKey(b),d=this._cache[c];if(d)for(var e=d.length-1;e>=0;e--){var f=d[e];this._map.hasLayer(f)&&this._map.removeLayer(f)}},addLayers:function(a){for(var b=a.length-1;b>=0;b--){var c=this._layers[a[b]];c&&c.addTo(this._map)}},removeLayers:function(a){for(var b=a.length-1;b>=0;b--){var c=this._layers[a[b]];c&&c.removeFrom(this._map)}},resetStyle:function(a){a.options=a.defaultOptions,this._setLayerStyle(a,this.options.style)},setStyle:function(a){this.eachLayer(function(b){this._setLayerStyle(b,a)},this)},_setLayerStyle:function(a,b){"function"==typeof b&&(b=b(a.feature)),a.setStyle&&a.setStyle(b)},bindPopup:function(a,b){this._popup=a;for(var c in this._layers){var d=this._layers[c],e=this._popup(d.feature,d);d.bindPopup(e,b)}},unbindPopup:function(){this._popup=!1;for(var a in this._layers)this._layers[a].unbindPopup()},eachFeature:function(a,b){for(var c in this._layers)a.call(b,this._layers[c]);return this},getFeature:function(a){return this._layers[a]}}),L.esri.featureLayer=function(a){return new L.esri.FeatureLayer(a)};