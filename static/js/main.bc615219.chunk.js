(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(t,e,n){t.exports=n(11)},11:function(t,e,n){"use strict";n.r(e);var a=n(1),i=n(2),r=n(4),o=n(3),s=n(6),l=n(5),u=n(0),c=n(9);var h={dark:40,lo:80,mid:160,hi:240};function f(t){var e=h.hi,n=h.mid,a=h.lo,i=h.dark,r=a,o=a,s=a;switch(t){case"white":r=e,o=e,s=e;break;case"black":r=i,o=i,s=i;break;case"blue":s=e;break;case"red":r=e;break;case"pink":r=e,o=n,s=n;break;case"green":o=e;break;case"brown":r=n,o=a,s=i;break;case"light-brown":r=e,o=n,s=a;break;case"dark-green":r=i,o=n,s=i;break;default:!function(t){throw new Error("Unexpected object: "+t)}(t)}return[r,o,s]}var v={};function d(t){return v[t]||(v[t]="rgb(".concat(f(t).join(","),")")),v[t]}var y,m=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(o.a)(e).call(this))).world=t,n.colorMap=[],n.sz=8,n.lastFilled=null,n._onScreenXStart=0,n._onScreenXEnd=9999,n._onScreenYStart=0,n._onScreenYEnd=9999,n}return Object(l.a)(e,t),Object(i.a)(e,[{key:"drawCell",value:function(t,e,n,a){a!==this.lastFilled&&(t.fillStyle=d(a),this.lastFilled=a),t.fillRect(e,n,this.sz,this.sz)}},{key:"draw",value:function(t,e){var n=this;this.emit("predraw",new u.Events.PreDrawEvent(t,e,this));var a=this.world.layers.clouds;this.lastFilled=null;var i=a.m,r=a.n,o=this._onScreenXStart,s=Math.min(this._onScreenXEnd,a.m-3),l=this._onScreenYStart,h=Math.min(this._onScreenYEnd,a.n-3);t.fillStyle="#642",t.fillRect(o,l,i*this.sz,r*this.sz),Object.entries(this.world.layers).forEach(function(e){var a=Object(c.a)(e,2),i=(a[0],a[1]);if(i.config.visible){i.config.translucent&&(t.globalAlpha=.6);var r=i.config.color;if(r){r!==n.lastFilled&&(t.fillStyle=d(r),n.lastFilled=r);for(var u=o;u<s;u++)for(var f=l;f<h;f++){var v=u,y=f;i.at({x:v,y:y})&&t.fillRect(v*n.sz,y*n.sz,n.sz,n.sz)}}i.config.translucent&&(t.globalAlpha=1)}}),this.emit("postdraw",new u.Events.PreDrawEvent(t,e,this))}},{key:"update",value:function(t,e){var n=t.screenToWorldCoordinates(new u.Vector(0,0)),a=t.screenToWorldCoordinates(new u.Vector(t.canvas.clientWidth,t.canvas.clientHeight)),i=this.sz,r=this.sz,o=this.pos.x,s=this.pos.y;this._onScreenXStart=Math.max(Math.floor((n.x-o)/i)-2,0),this._onScreenYStart=Math.max(Math.floor((n.y-s)/r)-2,0),this._onScreenXEnd=Math.max(Math.floor((a.x-o)/i)+2,0),this._onScreenYEnd=Math.max(Math.floor((a.y-s)/r)+2,0)}}]),e}(u.Actor);!function(t){t[t.Up=0]="Up",t[t.Down=1]="Down",t[t.Left=2]="Left",t[t.Right=3]="Right"}(y||(y={}));var g=function(){function t(e,n){var i=this;Object(a.a)(this,t),this.game=e,this.camera=n,this.dragging=!1,this.dragOrigin=void 0,this.pointerMoveCallback=void 0,this.leftClickCallback=void 0,this.cameraPanCallback=void 0,this.keyPressCallback=void 0,this.moveCam=function(t){i.cameraPanCallback&&i.cameraPanCallback();var e=1/i.camera.getZoom()*10,n=new u.Vector(0,0);switch(t){case y.Left:n.x=-e;break;case y.Right:n.x=e;break;case y.Up:n.y=-e;break;case y.Down:n.y=e}i.camera.move(i.camera.pos.add(n),0)}}return Object(i.a)(t,[{key:"onMove",value:function(t){this.pointerMoveCallback=t}},{key:"onLeftClick",value:function(t){this.leftClickCallback=t}},{key:"onCameraPan",value:function(t){this.cameraPanCallback=t}},{key:"onKeyPress",value:function(t){this.keyPressCallback=t}},{key:"activate",value:function(){var t=this;this.game.input.pointers.primary.on("move",function(e){t.dragging?t.dragOrigin&&(t.camera.pos=t.camera.pos.add(t.dragOrigin.sub(e.coordinates.worldPos))):t.pointerMoveCallback&&t.pointerMoveCallback(e.coordiantes.worldPos)}),this.game.input.pointers.primary.on("up",function(){t.dragging&&(t.dragging=!1)}),this.game.input.pointers.primary.on("down",function(e){e.target.button===u.Input.PointerButton.Left?t.camera.move(e.coordinates.worldPos,250):(t.dragging=!0,t.dragOrigin=e.coordinates.worldPos,console.log("DRAG EM",e))}),window.addEventListener("wheel",function(e){var n=t.camera.getZoom();e.deltaY<0?t.camera.zoom(Math.min(n+.05,2)):e.deltaY>0&&t.camera.zoom(Math.max(n-.05,.5)),console.log("wheeee",e)},{capture:!0,passive:!1}),this.game.input.keyboard.on("press",function(e){e.key===u.Input.Keys.Up||e.key===u.Input.Keys.W?t.moveCam(y.Up):e.key===u.Input.Keys.Left||e.key===u.Input.Keys.A?t.moveCam(y.Left):e.key===u.Input.Keys.Down||e.key===u.Input.Keys.S?t.moveCam(y.Down):e.key===u.Input.Keys.Right||e.key===u.Input.Keys.D?t.moveCam(y.Right):t.keyPressCallback&&t.keyPressCallback(e.key)}),this.game.input.keyboard.on("hold",function(e){e.key===u.Input.Keys.Up||e.key===u.Input.Keys.W?t.moveCam(y.Up):e.key===u.Input.Keys.Left||e.key===u.Input.Keys.A?t.moveCam(y.Left):e.key===u.Input.Keys.Down||e.key===u.Input.Keys.S?t.moveCam(y.Down):e.key!==u.Input.Keys.Right&&e.key!==u.Input.Keys.D||t.moveCam(y.Right)})}},{key:"deactivate",value:function(){this.game.input.keyboard.off("press"),this.game.input.keyboard.off("hold"),this.game.input.pointers.primary.off("down"),this.game.input.pointers.primary.off("up")}}]),t}(),b=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(o.a)(e).call(this,t))).game=t,n.worldView=void 0,n.nav=void 0,n.worldView=new m(t.world),n.nav=new g(t,n.camera),n}return Object(l.a)(e,t),Object(i.a)(e,[{key:"onInitialize",value:function(){this.add(this.worldView)}},{key:"onActivate",value:function(){this.nav.activate()}},{key:"onDeactivate",value:function(){this.nav.deactivate()}}]),e}(u.Scene),p=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(r.a)(this,Object(o.a)(e).call(this))).world=t,n.backgroundColor=u.Color.Black,n.pageScrollPreventionMode=u.ScrollPreventionMode.None,n.addScene("life",new b(Object(s.a)(n))),n.goToScene("life"),console.log("W O R L D     B O U N D"),console.log("Are you ready???"),n}return Object(l.a)(e,t),Object(i.a)(e,[{key:"onPreUpdate",value:function(){this.world.evolve()}}]),e}(u.Engine),k=function t(e){Object(a.a)(this,t),this.layers=e},w=function(t,e,n,a){return Math.abs(t-e)-Math.abs(n-a)};function M(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.5;return Math.random()<n?t:e}var x={},O=function(t){if(!x[t]){for(var e=[],n=0;n<=t;n++)e.push(n);x[t]=e}return x[t]};function j(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e[Math.floor(Math.random()*e.length)]}var C=n(8),S=n.n(C);function E(t,e){return t.reduce(function(t,n){return e(n)?++t:t},0)}function P(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4;return function(a,i){return function(t){var e=t.active,n=t.neighbors,a=t.birth,i=t.lonely,r=t.starve,o=E(n,Boolean);if(e){if(o<=i||o>=r)return"death"}else if(o===a)return"birth";return"unchanged"}({active:a,neighbors:i,birth:t,lonely:e,starve:n})}}function I(t,e,n){for(var a=0;a<t;a++)for(var i=0;i<e;i++)n(a,i)}var R=function(){function t(e,n){Object(a.a)(this,t),this.m=e,this.n=n,this.elements=void 0,this.elements=new S.a(e*n)}return Object(i.a)(t,[{key:"setAll",value:function(t){var e=this;this.elements.reset(),t.forEach(function(t,n){return e.elements.set(n,t)})}},{key:"at",value:function(t,e){return this.elements.get(this.addr(t,e))}},{key:"set",value:function(t,e,n){this.elements.set(this.addr(t,e),n)}},{key:"flip",value:function(t,e){this.elements.toggle(this.addr(t,e))}},{key:"addr",value:function(t,e){return e*this.m+t}}]),t}(),z=function(){function t(e,n){var i=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{initFn:function(){return M(!0,!1)},color:"red",translucent:!0};Object(a.a)(this,t),this.m=e,this.n=n,this.config=r,this.structure=void 0,this.structure=new R(e,n),O(e).forEach(function(t){return O(n).forEach(function(e){var n={x:t,y:e};i.put(n,r.initFn(n))})})}return Object(i.a)(t,null,[{key:"assemble",value:function(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return M(!0,!1)},i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return new t(e.x,e.y,{initFn:a,color:n,translucent:i,visible:r})}}]),Object(i.a)(t,[{key:"withinBounds",value:function(t,e){var n=this.m-1,a=this.n-1;return t>=0&&e>=0&&t<=n&&e<=a}},{key:"at",value:function(t){var e=t.x,n=t.y;if(this.withinBounds(e,n))return this.structure.at(e,n)}},{key:"put",value:function(t,e){var n=t.x,a=t.y;return!!this.withinBounds(n,a)&&(this.structure.set(n,a,e),!0)}},{key:"activate",value:function(t){this.put(t,!0)}},{key:"deactivate",value:function(t){this.put(t,!1)}},{key:"scale",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2;console.log("SCALE",{z:e});var n=new R(this.m,this.n);return I(this.m,this.n,function(a,i){var r=Math.floor(a/e),o=Math.floor(i/e),s=t.at({x:r,y:o});void 0!==s&&n.set(a,i,s)}),this.structure=n,this}},{key:"shift",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return M(!0,!1)},i=new R(this.m,this.n);return I(this.m,this.n,function(r,o){if(t.withinBounds(r+e,o+n)){var s=t.at({x:r+e,y:o+n});void 0!==s&&i.set(r,o,s)}else i.set(r,o,a())}),this.structure=i,this}},{key:"gatherNeighbors",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(n<1)throw new Error("Neighborhoods must have a radius > 1");var a=[];a=1===n?t.neighbors(e):t.community(e,n);var i=[],r=!0,o=!1,s=void 0;try{for(var l,u=a[Symbol.iterator]();!(r=(l=u.next()).done);r=!0){var c=l.value,h=this.at(c);void 0!==h&&i.push(h)}}catch(f){o=!0,s=f}finally{try{r||null==u.return||u.return()}finally{if(o)throw s}}return i}},{key:"judgeCell",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,e=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0,a=arguments.length>3?arguments[3]:void 0,i=arguments.length>4?arguments[4]:void 0,r=a(n,this.gatherNeighbors(e,t),e);r&&("death"===r?i.death.push(e):"birth"===r&&i.life.push(e))}},{key:"gol",value:function(){for(var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:P(),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,a={life:[],death:[]},i=0;i<this.m;i++)for(var r=0;r<this.n;r++){var o=i,s=r,l=this.at({x:o,y:s});void 0!==l&&this.judgeCell(n,{x:o,y:s},l,e,a)}a.life.forEach(function(e){t.activate(e)}),a.death.forEach(function(e){t.deactivate(e)})}},{key:"noise",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.1,e=0;e<this.m;e++)for(var n=0;n<this.n;n++)if(Math.random()<t){var a=e,i=n;void 0!==this.at({x:a,y:i})&&this.structure.flip(a,i)}}},{key:"smooth",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j(1,2),e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.25;this.gol(function(t,n,a){var i=n.reduce(function(t,e){return e?++t:t},0)/n.length;if(t){if(t&&i<.5-e)return"death"}else if(i>.5+e)return"birth"},t)}}],[{key:"neighbors",value:function(e){var n=e.x,a=e.y;if(t.neighborsMap[n]&&t.neighborsMap[n][a])return t.neighborsMap[n][a];var i=[{x:n-1,y:a},{x:n,y:a-1},{x:n,y:a+1},{x:n+1,y:a},{x:n-1,y:a-1},{x:n-1,y:a+1},{x:n+1,y:a-1},{x:n+1,y:a+1}];return t.neighborsMap[n]=t.neighborsMap[n]||[],t.neighborsMap[n][a]=i,i}},{key:"community",value:function(e,n){var a=e.x,i=e.y,r=n;if(1===r)return t.neighbors(e);if(t.communityMap[a]&&t.communityMap[a][i]&&t.communityMap[a][i][r])return t.communityMap[a][i][r];for(var o=n,s=[],l=a-o;l<a+o+1;l++)for(var u=i-o;u<i+o+1;u++)if(w(l,a,u,i)<=o){var c={x:a,y:i};s.push(c)}return t.communityMap[a]=t.communityMap[a]||[],t.communityMap[a][i]=t.communityMap[a][i]||[],t.communityMap[a][i][o]=s,s}}]),t}();z.neighborsMap=[],z.communityMap=[];var B={size:"small",waterRatio:.5,cloudRatio:.38,tickSeries:[1,1,2,3,5,7,11,13,17,19,23,29,31].map(function(t){return Math.pow(t,2)})},D={tiny:{x:128,y:64},small:{x:256,y:192},medium:{x:320,y:256},large:{x:512,y:384},huge:{x:768,y:512},gigantic:{x:1024,y:640},enormous:{x:1344,y:576}},K=n(7),L=function(){function t(){Object(a.a)(this,t)}return Object(i.a)(t,null,[{key:"cloudsGather",value:function(t){t.clouds.smooth(j(1,2,4),.212)}},{key:"oceanLevelsRise",value:function(t){var e=t.water,n=j.apply(void 0,Object(K.a)(O(4).map(function(t){return t+1})));e.smooth(n,.1185)}},{key:"cloudsForm",value:function(t){var e=t.clouds,n=t.water;e.gol(function(t,e,a){var i=E(e,Boolean);if(t);else{if(i>6)return"birth";if(i>5&&n.at(a))return"birth"}})}},{key:"treesGrow",value:function(t){var e=t.grass,n=(t.clouds,t.water);t.trees.gol(function(t,a,i){var r=E(a,Boolean),o=E(n.gatherNeighbors(i),Boolean),s=E(e.gatherNeighbors(i),Boolean)+r;if(t){if(o>1)return"death"}else if(0==o&&Math.random()<.1){if(r>=1&&s>5)return"birth";if(s>7&&Math.random()<.1)return"birth"}})}},{key:"grassGrows",value:function(t){var e=t.grass,n=t.clouds,a=t.water;e.gol(function(t,e,i){var r=E(e,Boolean),o=n.at(i),s=a.at(i),l=E(a.gatherNeighbors(i),Boolean);if(t){if(s)return"death"}else if(!s){if(l>1&&o)return n.deactivate(i),"birth";if(l>0&&r>0)return"birth";if(r>2)return"birth"}})}},{key:"trailsDecay",value:function(t){var e=t.trail,n=t.path;e.gol(function(t,e,n){if(t&&Math.random()<.02)return"death"}),n.gol(function(t,e,n){if(t&&Math.random()<.002)return"death"})}},{key:"animalsWander",value:function(t){var e=t.animals,n=t.water,a=t.trees,i=(t.grass,t.trail),r=t.path,o=[];e.gol(function(t,e,a){if(t){if(n.at(a))return"death";Math.random()<.8&&o.push(a)}}),o.forEach(function(t){var o=z.neighbors(t),s=(o=(o=o.filter(function(t){return e.withinBounds(t.x,t.y)&&!n.at(t)&&!e.at(t)})).sort(function(){return Math.random()>.5?-1:1})).find(function(t){return a.at(t)})||o.find(function(t){return r.at(t)})||o.find(function(t){return i.at(t)});(!s||Math.random()<.2)&&(s=j.apply(void 0,Object(K.a)(o))),s&&(e.deactivate(t),e.activate(s),a.at(s)&&a.deactivate(s),r.at(t)||(i.at(t)?Math.random()<.05&&E(r.gatherNeighbors(t),Boolean)<3&&r.activate(t):Math.random()<.7&&E(i.gatherNeighbors(t),Boolean)<4&&i.activate(t)))})}}]),t}();L.windPushesClouds=function(t,e){return function(n){n.clouds.shift(t,e,function(){return M(!0,!1,.4)})}};var A=function t(e){Object(a.a)(this,t),this.location=e};new p(new(function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:B;Object(a.a)(this,t),this.config=e,this.player=new A({x:10,y:10}),this.stack=void 0,this.dims=void 0,this.ticks=0,this.evolutionarySeries=[L.animalsWander,L.cloudsGather,L.windPushesClouds(-1,-1),L.treesGrow,L.cloudsForm,L.grassGrows,L.trailsDecay],this.dims=D[e.size],console.log("Assembling world layers..."),this.stack=new k({water:z.assemble(this.dims,"blue",function(){return M(!0,!1,e.waterRatio)}),grass:z.assemble(this.dims,"green",function(){return!1}),trees:z.assemble(this.dims,"dark-green",function(){return!1}),trail:z.assemble(this.dims,"pink",function(){return!1},!0,!1),path:z.assemble(this.dims,"light-brown",function(){return!1},!1,!1),animals:z.assemble(this.dims,"white",function(){return M(!0,!1,.01)},!1,!0),humans:z.assemble(this.dims,"white",function(){return!1},!1,!0),clouds:z.assemble(this.dims,"white",function(){return M(!0,!1,e.cloudRatio)},!0)}),console.log("World layers assembled!")}return Object(i.a)(t,[{key:"prepareLandscape",value:function(){var t=!0,e=!1,n=void 0;try{for(var a,i=O(1)[Symbol.iterator]();!(t=(a=i.next()).done);t=!0){var r=a.value,o=!0,s=!1,l=void 0;try{for(var u,c=O(5)[Symbol.iterator]();!(o=(u=c.next()).done);o=!0){var h=u.value;L.oceanLevelsRise(this.stack.layers),console.log("startup evolution I",h/5*100,r)}}catch(b){s=!0,l=b}finally{try{o||null==c.return||c.return()}finally{if(s)throw l}}this.stack.layers.water.scale(1.3);var f=!0,v=!1,d=void 0;try{for(var y,m=O(5)[Symbol.iterator]();!(f=(y=m.next()).done);f=!0){var g=y.value;L.oceanLevelsRise(this.stack.layers),console.log("startup evolution II",g/5*100,r)}}catch(b){v=!0,d=b}finally{try{f||null==m.return||m.return()}finally{if(v)throw d}}}}catch(b){e=!0,n=b}finally{try{t||null==i.return||i.return()}finally{if(e)throw n}}}},{key:"evolve",value:function(){var t=this,e=!1;return this.ticks+=1,this.ticks<9?(this.ticks>5&&this.prepareLandscape(),!0):(this.evolutionarySeries.forEach(function(n,a){var i=t.config.tickSeries[a];t.ticks%i===0&&n&&(n.call(t,t.layers),e=!0)}),e)}},{key:"layers",get:function(){return this.stack.layers}}]),t}())).start()}},[[10,1,2]]]);
//# sourceMappingURL=main.bc615219.chunk.js.map