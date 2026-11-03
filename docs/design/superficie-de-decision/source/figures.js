(function(){
var NS='http://www.w3.org/2000/svg';
function E(n,a,p){var e=document.createElementNS(NS,n);if(a)for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function R(seed){var s=seed>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function hex(c){return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]}
function mix(a,b,t){t=Math.max(0,Math.min(1,t));var A=hex(a),B=hex(b);return'rgb('+Math.round(A[0]+(B[0]-A[0])*t)+','+Math.round(A[1]+(B[1]-A[1])*t)+','+Math.round(A[2]+(B[2]-A[2])*t)+')'}
function G(u,v,cu,cv,su,sv){var a=(u-cu)/su,b=(v-cv)/sv;return Math.exp(-(a*a+b*b))}
var C={bg:'#0A151A',lo:'#2E5C6B',hi:'#EADBBE',warm:'#D6A266',mist:'#8FB2BB',ivory:'#F1EBDD',sand:'#E7D2AC',petrol:'#2B5563'};

/* superficies: z = f(u,v) en [-1,1]^2 */
function win(u,v){return(1-Math.pow(Math.abs(u),6))*(1-Math.pow(Math.abs(v),6))}
var F={
 hero:function(u,v){return win(u,v)*(.95*G(u,v,.18,-.05,.34,.42)+.5*G(u,v,-.55,.42,.26,.32)+.36*G(u,v,.62,.5,.28,.22)+.3*G(u,v,-.25,-.62,.3,.22)+.05*Math.sin(3*u+1)*Math.cos(2.4*v)+.05)},
 decerno:function(u,v){var s=.5*(1+Math.tanh(2.4*(.9*u-.55*v+.05)));return win(u,v)*(.1+.62*s+.3*G(u,v,.45,-.25,.3,.34)-.16*G(u,v,-.5,.55,.3,.3)+.04*Math.sin(4*v+u))},
 glyph:function(u,v){return win(u,v)*(G(u,v,.1,0,.5,.5)+.2)}
};
function dens(u,v){return Math.exp(-((u-.12)*(u-.12)+(v+.05)*(v+.05)*1.3)/.85)}

var PRE={
 hero:{f:'hero',N:48,th:38,ph:50,S:246,Z:360,cx:.5,cy:.56,t:.5,zmax:1,bars:true,pts:46,seed:7,
  anch:{obs:[-.12,.34],surf:[.18,-.05],unc:[.42,-.5],thr:[.02,-.35,.6]},
  lab:{obs:[318,128,'s'],surf:[600,40,'s'],unc:[905,560,'e'],thr:[262,664,'s']},
  legend:[['obs','01','Observaciones','Datos simulados'],['surf','02','Superficie estimada','Respuesta del modelo'],['unc','03','Incertidumbre','Mayor donde hay menos datos'],['thr','04','Umbral de decisión','Región que justifica actuar']]},
 plate:{f:'decerno',N:44,th:36,ph:48,S:215,Z:290,cx:.52,cy:.56,t:.52,zmax:1,bars:true,pts:36,seed:21},
 head:{f:'decerno',N:50,th:36,ph:48,S:236,Z:280,cx:.46,cy:.6,t:.5,zmax:1,bars:true,pts:60,seed:21,
  anch:{thr:[-.1,-.5,.8]},lab:{thr:[430,70,'s']},legend:[['thr','','Efecto = umbral de decisión','Frontera entre actuar y no actuar']]},
 mini:{f:'hero',N:30,th:38,ph:50,S:170,Z:190,cx:.5,cy:.6,t:.44,zmax:1,bars:false,pts:0,seed:3},
 phone:{f:'hero',N:34,th:38,ph:52,S:200,Z:240,cx:.5,cy:.56,t:.44,zmax:1,bars:true,pts:36,seed:9},
 glyph:{f:'glyph',N:7,th:38,ph:52,S:20,Z:22,cx:.5,cy:.62,t:9,zmax:1,bars:false,pts:0,seed:1,sw:.8}
};

function surface(svg,p){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height;
 var N=p.N,th=p.th*Math.PI/180,ph=p.ph*Math.PI/180,S=p.S,Z=p.Z,cx=p.cx*W,cy=p.cy*H;
 var ct=Math.cos(th),st=Math.sin(th),sp=Math.sin(ph),cp=Math.cos(ph),f=F[p.f],t=p.t,sw=p.sw||.6;
 function P(u,v,z){var x=u*ct-v*st,d=u*st+v*ct;return[cx+x*S,cy-d*S*sp-z*Z*cp,d]}
 var zs=[],ps=[],i,j;
 for(i=0;i<=N;i++){zs[i]=[];ps[i]=[];for(j=0;j<=N;j++){var u=-1+2*i/N,v=-1+2*j/N,z=f(u,v);zs[i][j]=z;ps[i][j]=P(u,v,z)}}
 var items=[],dk=(2/N)*.8;
 function pts(a){return a.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1)}).join(' ')}
 for(i=0;i<N;i++)for(j=0;j<N;j++)(function(i,j){
  var a=ps[i][j],b=ps[i+1][j],c=ps[i+1][j+1],d=ps[i][j+1];
  items.push({k:(a[2]+b[2]+c[2]+d[2])/4,fn:function(g){
   var za=zs[i][j],zb=zs[i+1][j],zc=zs[i+1][j+1],zd=zs[i][j+1],zm=(za+zb+zc+zd)/4,h=Math.min(1,zm/p.zmax),hot=zm>=t;
   E('polygon',{points:pts([a,b,c,d]),fill:mix(C.bg,hot?C.warm:C.hi,(hot?.07:0)+h*.2),stroke:hot?C.warm:mix(C.lo,C.hi,Math.pow(h,.75)),'stroke-opacity':hot?(.5+.35*h):(.42+.45*h),'stroke-width':sw,'stroke-linejoin':'round'},g);
   var u0=-1+2*i/N,u1=-1+2*(i+1)/N,v0=-1+2*j/N,v1=-1+2*(j+1)/N,cr=[];
   function ed(z1,z2,ua,va,ub,vb){if((z1-t)*(z2-t)<0){var s=(t-z1)/(z2-z1);cr.push([ua+(ub-ua)*s,va+(vb-va)*s])}}
   ed(za,zb,u0,v0,u1,v0);ed(zb,zc,u1,v0,u1,v1);ed(zd,zc,u0,v1,u1,v1);ed(za,zd,u0,v0,u0,v1);
   if(cr.length==2){var A=P(cr[0][0],cr[0][1],t),B=P(cr[1][0],cr[1][1],t);E('line',{x1:A[0],y1:A[1],x2:B[0],y2:B[1],stroke:'#F6E3BF','stroke-width':1.7,'stroke-linecap':'round'},g)}
  }});
 })(i,j);
 if(p.bars)for(i=4;i<N;i+=8)for(j=4;j<N;j+=8)(function(i,j){
  var u=-1+2*i/N,v=-1+2*j/N,z=zs[i][j];if(z<.04)return;
  var sg=.04+.15*(1-dens(u,v)),a=P(u,v,z+sg),b=P(u,v,z-sg),m=ps[i][j];
  items.push({k:m[2]-dk,fn:function(g){E('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#C9DDE1','stroke-width':1,'stroke-opacity':.85},g);
   E('line',{x1:a[0]-3,y1:a[1],x2:a[0]+3,y2:a[1],stroke:'#C9DDE1','stroke-width':1,'stroke-opacity':.85},g);
   E('line',{x1:b[0]-3,y1:b[1],x2:b[0]+3,y2:b[1],stroke:'#C9DDE1','stroke-width':1,'stroke-opacity':.85},g);
   E('circle',{cx:m[0],cy:m[1],r:1.7,fill:C.sand},g)}});
 })(i,j);
 var rnd=R(p.seed),pl=[];
 var extra=(p.anch&&p.anch.obs)?[p.anch.obs]:[];
 extra.forEach(function(q){pl.push(q)});
 var tries=0;while(pl.length<p.pts&&tries++<4000){var uu=rnd()*2-1,vv=rnd()*2-1;if(rnd()<dens(uu,vv)*.9+.05)pl.push([uu,vv])}
 pl.forEach(function(q){var z=f(q[0],q[1])+(rnd()-.5)*.22+.03,m=P(q[0],q[1],Math.max(z,.02));
  items.push({k:m[2]-dk*1.3,fn:function(g){E('circle',{cx:m[0],cy:m[1],r:1.9,fill:C.ivory,'fill-opacity':.92},g)}})});
 items.sort(function(x,y){return y.k-x.k});
 var g=E('g',{},svg);items.forEach(function(it){it.fn(g)});
 if(p.legend){
  var an={};
  Object.keys(p.anch).forEach(function(k){var a=p.anch[k],u,v;
   if(k=='thr'){v=a[0];var prev=null;for(u=a[1];u<=a[2];u+=.004){var d=f(u,v)-t;if(prev!==null&&prev*d<0)break;prev=d}}else{u=a[0];v=a[1]}
   var z=f(u,v);if(k=='obs')z+=.03;if(k=='unc')z+=0;an[k]=P(u,v,z)});
  if(p.badges){p.legend.forEach(function(L){var a=an[L[0]];E('circle',{cx:a[0],cy:a[1],r:11,fill:C.bg,stroke:C.sand,'stroke-width':1.3},svg);var q=E('text',{x:a[0],y:a[1]+4.2,'text-anchor':'middle',style:'font:500 12px IBM Plex Mono,monospace;fill:#F1EBDD'},svg);q.textContent=L[1].replace('0','')});return}
  p.legend.forEach(function(L){var a=an[L[0]],lb=p.lab[L[0]],anchor=lb[2]=='e'?'end':'start',lx=lb[0],ly=lb[1];
   var ex=lx+(anchor=='end'?10:-10);
   E('circle',{cx:a[0],cy:a[1],r:5,fill:'none',stroke:C.sand,'stroke-width':1},svg);
   E('path',{d:'M'+a[0]+' '+a[1]+' L'+ex+' '+ly+' L'+lx+' '+ly,fill:'none',stroke:C.mist,'stroke-opacity':.7,'stroke-width':.9},svg);
   var dx=anchor=='end'?-8:8,tx=lx+dx;
   if(L[1]){var n=E('text',{x:tx,y:ly-17,'text-anchor':anchor,class:'lg-n'},svg);n.textContent=L[1]}
   var t1=E('text',{x:tx,y:ly+1,'text-anchor':anchor,class:'lg-t'},svg);t1.textContent=L[2];
   var t2=E('text',{x:tx,y:ly+19,'text-anchor':anchor,class:'lg-d'},svg);t2.textContent=L[3]});
 }
}

/* abanico de pronóstico */
function fan(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,r=R(5),padL=8,padR=8,top=18,bot=H-24,n=140,t0=.5;
 function x(t){return padL+t*(W-padL-padR)}
 var obs=[],i,seas=function(t){return .52+.17*Math.sin(2*Math.PI*t*6.2)+.12*t};
 for(i=0;i<=n;i++){var t=i/n*t0;obs.push(seas(t)+(r()-.5)*.07)}
 function y(v){return top+(1-v)*(bot-top)}
 var med=[],sg=[],m=60;
 for(i=0;i<=m;i++){var t=t0+(1-t0)*i/m;med.push(seas(t));sg.push(.012+.17*Math.sqrt(i/m))}
 function bandPath(z){var up=[],lo=[];for(i=0;i<=m;i++){var t=t0+(1-t0)*i/m;up.push(x(t)+','+y(med[i]+z*sg[i]));lo.push(x(t)+','+y(med[i]-z*sg[i]))}return'M'+up.join('L')+'L'+lo.reverse().join('L')+'Z'}
 E('line',{x1:padL,y1:bot,x2:W-padR,y2:bot,stroke:C.mist,'stroke-opacity':.35},svg);
 for(i=0;i<=20;i++)E('line',{x1:x(i/20),y1:bot,x2:x(i/20),y2:bot+(i%5?3:6),stroke:C.mist,'stroke-opacity':.4},svg);
 E('path',{d:bandPath(1.64),fill:C.petrol,'fill-opacity':.42},svg);
 E('path',{d:bandPath(.67),fill:C.mist,'fill-opacity':.26},svg);
 for(var k=0;k<26;k++){var ph1=r()*6.28,ph2=r()*6.28,a1=.5+r()*.6,a2=.3+r()*.5,d=[];
  for(i=0;i<=m;i++){var q=i/m,t=t0+(1-t0)*q,off=sg[i]*1.3*(a1*Math.sin(ph1+q*5)+a2*Math.sin(ph2+q*11));d.push(x(t)+','+y(med[i]+off))}
  E('path',{d:'M'+d.join('L'),fill:'none',stroke:C.mist,'stroke-opacity':.28,'stroke-width':.7},svg)}
 E('path',{d:'M'+med.map(function(v,i){return x(t0+(1-t0)*i/m)+','+y(v)}).join('L'),fill:'none',stroke:C.sand,'stroke-width':1.7},svg);
 E('path',{d:'M'+obs.map(function(v,i){return x(i/n*t0)+','+y(v)}).join('L'),fill:'none',stroke:C.ivory,'stroke-width':1.3,'stroke-linejoin':'round'},svg);
 E('line',{x1:x(t0),y1:top-6,x2:x(t0),y2:bot,stroke:C.warm,'stroke-dasharray':'3 3','stroke-opacity':.9},svg);
 var a=E('text',{x:x(t0)-8,y:top+4,'text-anchor':'end',class:'ax'},svg);a.textContent='Observado';
 var b=E('text',{x:x(t0)+8,y:top+4,class:'ax'},svg);b.textContent='Pronóstico · 50 % / 90 %';
}

/* mosaico de calidad de datos */
function mosaic(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,r=R(11),rows=+(svg.dataset.rows||9),pad=10,lab=22;
 var s=(H-2*pad-lab)/rows,cols=Math.floor((W-2*pad)/s),gap=2.2,tones=['#2B5563','#3A6B7A','#4D8392','#35606E','#5E8792'];
 var ox=(W-cols*s)/2,oy=pad,b1=Math.round(cols/3),b2=Math.round(cols*2/3);
 for(var c=0;c<cols;c++){var z=c<b1?0:(c<b2?1:2),base=tones[c%5];
  for(var q=0;q<rows;q++){var p=r(),x=ox+c*s,y=oy+q*s,jit=z==0?(r()-.5)*1.6:0;
   var hollow=z==0?p<.17:(z==1?p<.05:false),flag=z==0?(p>.94):(z==1?(p>.985):false);
   if(hollow)E('rect',{x:x+jit+.6,y:y+.6,width:s-gap-.6,height:s-gap-.6,fill:'none',stroke:C.mist,'stroke-opacity':.45,'stroke-width':.8,'stroke-dasharray':'2 2'},svg);
   else E('rect',{x:x+jit,y:y,width:s-gap,height:s-gap,fill:flag?C.warm:(z==2?'#5E8792':base),'fill-opacity':flag?.95:(z==2?.72:.3+r()*.5)},svg)}}
 [['Bruto',0],['Depuración',b1],['Confiable',b2]].forEach(function(l){var t=E('text',{x:ox+l[1]*s,y:H-6,class:'ax'},svg);t.textContent=l[0]});
}

/* dos distribuciones: práctica y desarrollo */
function dist(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,base=H-46,pad=20;
 function nrm(x,m,s){return Math.exp(-.5*(x-m)*(x-m)/(s*s))/(s*Math.sqrt(2*Math.PI))}
 function curve(m,s,k){var d=[];for(var i=0;i<=200;i++){var x=i/200;d.push((pad+x*(W-2*pad)).toFixed(1)+','+(base-nrm(x,m,s)*k).toFixed(1))}return d}
 var defs=E('defs',{},svg),lg=E('linearGradient',{id:'gA',x1:0,y1:0,x2:0,y2:1},defs);
 E('stop',{offset:0,'stop-color':C.ivory,'stop-opacity':.28},lg);E('stop',{offset:1,'stop-color':C.ivory,'stop-opacity':0},lg);
 var lg2=E('linearGradient',{id:'gB',x1:0,y1:0,x2:0,y2:1},defs);
 E('stop',{offset:0,'stop-color':C.warm,'stop-opacity':.2},lg2);E('stop',{offset:1,'stop-color':C.warm,'stop-opacity':0},lg2);
 var kA=H*.128,A=curve(.3,.085,kA),B=curve(.58,.2,kA);
 E('line',{x1:pad,y1:base,x2:W-pad,y2:base,stroke:C.mist,'stroke-opacity':.4},svg);
 for(var i=0;i<=20;i++)E('line',{x1:pad+i/20*(W-2*pad),y1:base,x2:pad+i/20*(W-2*pad),y2:base+(i%5?3:6),stroke:C.mist,'stroke-opacity':.4},svg);
 E('path',{d:'M'+B.join('L')+'L'+(W-pad)+','+base+'L'+pad+','+base+'Z',fill:'url(#gB)'},svg);
 E('path',{d:'M'+B.join('L'),fill:'none',stroke:C.warm,'stroke-width':1.4,'stroke-dasharray':'5 4'},svg);
 E('path',{d:'M'+A.join('L')+'L'+(W-pad)+','+base+'L'+pad+','+base+'Z',fill:'url(#gA)'},svg);
 E('path',{d:'M'+A.join('L'),fill:'none',stroke:C.ivory,'stroke-width':1.7},svg);
 var x1=pad+.3*(W-2*pad);E('line',{x1:x1,y1:base-kA*nrm(.3,.3,.085)-14,x2:x1,y2:base,stroke:C.ivory,'stroke-opacity':.35,'stroke-dasharray':'2 3'},svg);
 function tx(x,y,s,cls,an){var t=E('text',{x:x,y:y,class:cls||'ax','text-anchor':an||'start'},svg);t.textContent=s}
 tx(pad,24,'Práctica analítica','lg-t');tx(pad,42,'Reporting · BI · calidad de datos','lg-d');
 tx(pad+.62*(W-2*pad),base-kA*nrm(.58,.58,.2)-34,'Ciencia de datos','lg-t');tx(pad+.62*(W-2*pad),base-kA*nrm(.58,.58,.2)-16,'En desarrollo · más incertidumbre','lg-d');
 tx(pad,H-10,'Analítica operativa','ax');tx(W-pad,H-10,'Modelado · inferencia · ML','ax','end');
}

/* intervalos de efecto (ilustrativo) */
function forest(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,r=R(17),L=160,R2=W-30,top=34,rows=5,gap=(H-top-52)/rows;
 function x(v){return L+(v+1)/2*(R2-L)}
 var ax=E('line',{x1:L,y1:H-40,x2:R2,y2:H-40,stroke:'#5A6A70','stroke-opacity':.6},svg);
 for(var i=-4;i<=4;i++){E('line',{x1:x(i/4),y1:H-40,x2:x(i/4),y2:H-35,stroke:'#5A6A70'},svg)}
 E('line',{x1:x(0),y1:top-10,x2:x(0),y2:H-40,stroke:'#14232A','stroke-opacity':.5,'stroke-dasharray':'3 3'},svg);
 E('line',{x1:x(.28),y1:top-10,x2:x(.28),y2:H-40,stroke:'#B07A3E','stroke-width':1.3},svg);
 var t=E('text',{x:x(.28)+6,y:top-2,class:'axp',fill:'#B07A3E',style:'fill:#B07A3E'},svg);t.textContent='Umbral de decisión';
 var t0=E('text',{x:x(0)-6,y:top-2,class:'axp','text-anchor':'end'},svg);t0.textContent='Sin efecto';
 for(i=0;i<rows;i++){var c=-.1+r()*.7,w=.12+r()*.3,y=top+i*gap+gap/2;
  var tt=E('text',{x:L-18,y:y+3.5,class:'axp','text-anchor':'end',style:'fill:#14232A'},svg);tt.textContent='Intervención '+(i+1);
  E('line',{x1:x(c-w),y1:y,x2:x(c+w),y2:y,stroke:'#14232A','stroke-width':1.6},svg);
  E('line',{x1:x(c-w),y1:y-5,x2:x(c-w),y2:y+5,stroke:'#14232A'},svg);E('line',{x1:x(c+w),y1:y-5,x2:x(c+w),y2:y+5,stroke:'#14232A'},svg);
  E('rect',{x:x(c)-4.5,y:y-4.5,width:9,height:9,fill:'#14232A'},svg)}
 var xl=E('text',{x:(L+R2)/2,y:H-14,class:'axp','text-anchor':'middle'},svg);xl.textContent='Efecto estimado · unidades a definir';
}

/* costura entre secciones */
function seam(svg){
 var W=svg.viewBox.baseVal.width,H=+svg.getAttribute('height'),top=svg.dataset.top,bot=svg.dataset.bot;
 E('rect',{x:0,y:0,width:W,height:H,fill:top},svg);
 var ka=H/110;function yy(x,k){return H*.52-k*13*ka+(26*Math.sin(x/190+1)+14*Math.sin(x/71+k*.4)+10*Math.sin(x/430+2))*ka}
 for(var k=5;k>=1;k--){var d=[];for(var x=0;x<=W;x+=12)d.push(x+','+yy(x,k).toFixed(1));
  E('path',{d:'M'+d.join('L'),fill:'none',stroke:'#8FB2BB','stroke-opacity':.08+.05*(5-k),'stroke-width':.9},svg)}
 var d0=[];for(var x=0;x<=W;x+=6)d0.push(x+','+yy(x,0).toFixed(1));
 E('path',{d:'M'+d0.join('L')+'L'+W+','+H+'L0,'+H+'Z',fill:bot},svg);
 E('path',{d:'M'+d0.join('L'),fill:'none',stroke:'#E7D2AC','stroke-opacity':.55,'stroke-width':1},svg);
}

/* glifos de etapa */
function glyph(svg,kind){
 var s=svg.getAttribute('data-s')||'',o={fill:'none',stroke:C.mist,'stroke-width':1};
 if(kind=='explore'){var r=R(4);for(var i=0;i<14;i++)E('circle',{cx:6+r()*32,cy:6+r()*32,r:1.5,fill:C.ivory,'fill-opacity':.85},svg);E('rect',{x:3,y:3,width:38,height:38,fill:'none',stroke:C.mist,'stroke-opacity':.4,'stroke-dasharray':'2 3'},svg)}
 if(kind=='model'){svg.setAttribute('viewBox','0 0 44 44');surface(svg,PRE.glyph)}
 if(kind=='eval'){[[10,12,30],[22,8,26],[34,16,34]].forEach(function(b){E('line',{x1:b[0],y1:b[1],x2:b[0],y2:b[2],stroke:C.mist,'stroke-width':1.2},svg);E('line',{x1:b[0]-4,y1:b[1],x2:b[0]+4,y2:b[1],stroke:C.mist},svg);E('line',{x1:b[0]-4,y1:b[2],x2:b[0]+4,y2:b[2],stroke:C.mist},svg);E('circle',{cx:b[0],cy:(b[1]+b[2])/2,r:2,fill:C.sand},svg)})}
 if(kind=='decide'){E('path',{d:'M3 36 C14 36 18 30 22 22 S32 8 41 7',fill:'none',stroke:C.mist,'stroke-width':1.3},svg);E('line',{x1:3,y1:20,x2:41,y2:20,stroke:C.warm,'stroke-dasharray':'3 3'},svg);E('circle',{cx:23,cy:20,r:3.2,fill:C.sand},svg)}
}

/* monograma */
function mono(svg){E('circle',{cx:14,cy:14,r:11,fill:'none',stroke:'#E7D2AC','stroke-width':1},svg);E('path',{d:'M7 18 C11 18 12 11 14 11 S17 18 21 18',fill:'none',stroke:'#F1EBDD','stroke-width':1.1},svg);E('line',{x1:5,y1:14,x2:23,y2:14,stroke:'#D6A266','stroke-width':.9,'stroke-dasharray':'2 2'},svg)}


/* mapa de contornos: efecto estimado según dos contextos (vista en planta) */
function contour(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,cp=svg.dataset.c==='1',L=cp?44:64,B=cp?34:46,T=16,Rr=16;
 var pw=W-L-Rr,ph=H-T-B,nx=cp?70:100,ny=Math.round(nx*ph/pw),f=F.decerno,t=.52,z=[],i,j;
 for(j=0;j<=ny;j++){z[j]=[];for(i=0;i<=nx;i++)z[j][i]=f(-1+2*i/nx,1-2*j/ny)}
 function X(i){return L+i/nx*pw}function Y(j){return T+j/ny*ph}
 for(j=0;j<ny;j++)for(i=0;i<nx;i++){var m=(z[j][i]+z[j][i+1]+z[j+1][i]+z[j+1][i+1])/4;if(m>=t)E('rect',{x:X(i),y:Y(j),width:pw/nx+.4,height:ph/ny+.4,fill:C.warm,'fill-opacity':.13},svg)}
 E('rect',{x:L,y:T,width:pw,height:ph,fill:'none',stroke:C.mist,'stroke-opacity':.35},svg);
 [.1,.2,.3,.4,t,.62,.72,.82].forEach(function(lv){
  var d='';
  for(j=0;j<ny;j++)for(i=0;i<nx;i++){
   var a=z[j][i],b=z[j][i+1],c=z[j+1][i+1],e=z[j+1][i],cr=[];
   function ed(z1,z2,x1,y1,x2,y2){if((z1-lv)*(z2-lv)<0){var s=(lv-z1)/(z2-z1);cr.push([x1+(x2-x1)*s,y1+(y2-y1)*s])}}
   ed(a,b,X(i),Y(j),X(i+1),Y(j));ed(b,c,X(i+1),Y(j),X(i+1),Y(j+1));ed(e,c,X(i),Y(j+1),X(i+1),Y(j+1));ed(a,e,X(i),Y(j),X(i),Y(j+1));
   if(cr.length==2)d+='M'+cr[0][0].toFixed(1)+' '+cr[0][1].toFixed(1)+'L'+cr[1][0].toFixed(1)+' '+cr[1][1].toFixed(1)
  }
  var thr=lv===t;E('path',{d:d,fill:'none',stroke:thr?'#F6E3BF':C.mist,'stroke-opacity':thr?1:.42,'stroke-width':thr?2:.8,'stroke-linecap':'round'},svg)});
 var r=R(29),n=cp?30:46,k=0;
 while(k<n){var u=r()*2-1,v=r()*2-1;if(r()<dens(u,v)*.9+.12){k++;var px=L+(u+1)/2*pw,py=T+(1-v)/2*ph;E('circle',{cx:px,cy:py,r:cp?2.3:2.6,fill:f(u,v)>=t?C.sand:C.ivory,'fill-opacity':.92},svg)}}
 function P(u,v){return[L+(u+1)/2*pw,T+(1-v)/2*ph]}
 var a=P(.5,-.2),b=P(-.62,.5);
 function tx(x,y,s,c,st){var q=E('text',{x:x,y:y,class:c,style:st||''},svg);q.textContent=s}
 tx(a[0]-(cp?44:60),a[1],'Región de acción','lg-t','fill:#F6E3BF;font-size:'+(cp?14:17)+'px');
 tx(b[0]-(cp?30:40),b[1],'No actuar','lg-t','fill:#A9C7CE;font-size:'+(cp?14:17)+'px');
 for(i=0;i<=10;i++){E('line',{x1:L+i/10*pw,y1:T+ph,x2:L+i/10*pw,y2:T+ph+(i%5?4:8),stroke:C.mist,'stroke-opacity':.5},svg);E('line',{x1:L,y1:T+i/10*ph,x2:L-(i%5?4:8),y2:T+i/10*ph,stroke:C.mist,'stroke-opacity':.5},svg)}
 tx(L,H-6,'Contexto A → · datos simulados','ax');
 var yl=E('text',{x:0,y:0,class:'ax',transform:'translate(14 '+(T+ph/2+50)+') rotate(-90)'},svg);yl.textContent='Contexto B →';
 if(!cp){var tl=E('text',{x:L+pw-8,y:T+ph-12,class:'lg-d','text-anchor':'end',style:'fill:#F0D3A4'},svg);tl.textContent='— Umbral de decisión'}
}

/* resultados potenciales, efecto estimado y umbral (inferencia causal) */
function rain(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,cp=svg.dataset.c==='1',L=cp?18:36,Rr=cp?18:36,aw=W-L-Rr,r=R(33);
 function X(v){return L+v*aw}
 function g(x,m,s){return Math.exp(-.5*(x-m)*(x-m)/(s*s))}
 function curve(m,s,base,h,col,fo){var d=[],i;for(i=0;i<=160;i++){var x=i/160;d.push(X(x).toFixed(1)+','+(base-g(x,m,s)*h).toFixed(1))}
  E('path',{d:'M'+d.join('L')+'L'+X(1)+','+base+'L'+X(0)+','+base+'Z',fill:col,'fill-opacity':fo},svg);
  E('path',{d:'M'+d.join('L'),fill:'none',stroke:col,'stroke-width':1.7},svg);E('line',{x1:X(0),y1:base,x2:X(1),y2:base,stroke:C.mist,'stroke-opacity':.35},svg)}
 function gauss(){var u=1-r(),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
 function dots(m,s,base,col,n){for(var i=0;i<n;i++){var x=m+gauss()*s;E('circle',{cx:X(x),cy:base+9+r()*(cp?16:26),r:cp?2:2.4,fill:col,'fill-opacity':.85},svg)}}
 function tx(x,y,s,cls,st,an){var q=E('text',{x:x,y:y,class:cls,style:st||'','text-anchor':an||'start'},svg);q.textContent=s}
 var hh=H*.185,bA=H*.235,bB=H*.54,bC=H*.895-(cp?10:18),mA=.36,mB=.53,sA=.085,sB=.095;
 [[mA,C.mist],[mB,C.sand]].forEach(function(q){E('line',{x1:X(q[0]),y1:bA-hh*1.05,x2:X(q[0]),y2:bB,stroke:q[1],'stroke-opacity':.55,'stroke-dasharray':'3 4'},svg)});
 curve(mA,sA,bA,hh,C.mist,.16);dots(mA,sA,bA,C.mist,cp?18:30);
 curve(mB,sB,bB,hh,C.sand,.16);dots(mB,sB,bB,C.sand,cp?18:30);
 var gy=bB-hh-(cp?9:13);
 E('line',{x1:X(mA)+4,y1:gy,x2:X(mB)-4,y2:gy,stroke:C.ivory,'stroke-width':1.2},svg);
 E('path',{d:'M'+(X(mB)-4)+' '+gy+'l-6 -3.5M'+(X(mB)-4)+' '+gy+'l-6 3.5',stroke:C.ivory,fill:'none'},svg);
 tx(X(mB)+10,gy+7,'Δ','lg-t','font:italic 400 '+(cp?20:24)+'px Fraunces,serif;fill:#F1EBDD','start');
 for(var i=0;i<=20;i++)E('line',{x1:X(i/20),y1:bB,x2:X(i/20),y2:bB+(i%5?0:6),stroke:C.mist,'stroke-opacity':.4},svg);
 function XE(e){return L+(e+.12)/.62*aw}
 var mE=.17,sE=.052,d=[],i2,e;
 for(i2=0;i2<=160;i2++){e=-.12+i2/160*.62;d.push(XE(e).toFixed(1)+','+(bC-g(e,mE,sE)*hh).toFixed(1))}
 var thr=.10,dd=[];
 for(i2=0;i2<=160;i2++){e=-.12+i2/160*.62;if(e>=thr)dd.push(XE(e).toFixed(1)+','+(bC-g(e,mE,sE)*hh).toFixed(1))}
 E('path',{d:'M'+XE(thr)+','+bC+'L'+dd.join('L')+'L'+XE(.5)+','+bC+'Z',fill:C.warm,'fill-opacity':.32},svg);
 E('path',{d:'M'+d.join('L'),fill:'none',stroke:C.warm,'stroke-width':1.8},svg);
 E('line',{x1:XE(-.12),y1:bC,x2:XE(.5),y2:bC,stroke:C.mist,'stroke-opacity':.35},svg);
 E('line',{x1:XE(thr),y1:bC-hh*1.12,x2:XE(thr),y2:bC+(cp?30:40),stroke:'#F6E3BF','stroke-width':1.6},svg);
 E('line',{x1:XE(0),y1:bC,x2:XE(0),y2:bC+8,stroke:C.mist},svg);
 var iy=bC+(cp?20:26);
 E('line',{x1:XE(mE-1.64*sE),y1:iy,x2:XE(mE+1.64*sE),y2:iy,stroke:C.ivory,'stroke-width':2},svg);
 [mE-1.64*sE,mE+1.64*sE].forEach(function(q){E('line',{x1:XE(q),y1:iy-5,x2:XE(q),y2:iy+5,stroke:C.ivory,'stroke-width':1.4},svg)});
 E('rect',{x:XE(mE)-4.5,y:iy-4.5,width:9,height:9,fill:C.sand},svg);
 tx(XE(0),iy+5,'Sin efecto','ax','','end');
 if(cp)tx(XE(thr)-8,bC-hh*.55,'Umbral de decisión','lg-d','fill:#F6E3BF;font-size:12px','end');else tx(XE(thr)+8,bC-hh*1.12-6,'Umbral de decisión','lg-d','fill:#F6E3BF;font-size:13.5px','start');
 tx(XE(mE+1.64*sE)+10,iy+4,'Intervalo','ax','');
 var ts=cp?14.5:17,ds=cp?11.5:12.5,off=cp?hh*.78:hh*.75;
 [[bA,'Sin intervención','Resultado potencial A','e'],[bB,'Con intervención','Resultado potencial B','s'],[bC,'Efecto estimado','Diferencia B − A','e']].forEach(function(q){
  var x=cp?(q[3]=='e'?W-L:L):L,an=cp?(q[3]=='e'?'end':'start'):'start',y=cp?q[0]-hh*.85:q[0]-off-6;
  tx(x,y,q[1],'lg-t','font-size:'+ts+'px',an);tx(x,y+(cp?17:19),q[2],'lg-d','font-size:'+ds+'px',an)});
 if(!cp)tx(L,bB+52,'Resultado · unidades a definir','ax','','start');
}

/* ruta de evolución: base analítica hacia ciencia de datos */
function route(svg){
 var vb=svg.viewBox.baseVal,W=vb.width,H=vb.height,cp=svg.dataset.c==='1',pts=[],N=180,i;
 function pt(t){var x=24+t*(W-48),s=t*t*(3-2*t),y=H*.72-s*(H*.46)+Math.sin(t*9)*(H*.012);return[x,y]}
 for(i=0;i<=N;i++)pts.push(pt(i/N));
 function seg(a,b,attr){var o={d:'M'+pts.slice(a,b+1).map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1)}).join('L'),fill:'none','stroke-linejoin':'round'};for(var k in attr)o[k]=attr[k];E('path',o,svg)}
 seg(0,60,{stroke:C.ivory,'stroke-width':2.4});
 seg(60,120,{stroke:C.sand,'stroke-width':2.4,'stroke-dasharray':'8 6'});
 seg(120,180,{stroke:C.mist,'stroke-width':2.6,'stroke-dasharray':'1.5 7','stroke-linecap':'round'});
 function tx(x,y,s,cls,an,st){var q=E('text',{x:x,y:y,class:cls,'text-anchor':an||'start',style:st||''},svg);q.textContent=s}
 var fs=cp?14.5:17,fd=cp?11.5:12.5,lh=cp?17:20;
 function node(t,kind,l1,l2,dx,dy,an){var p=pt(t);
  if(kind=='full')E('circle',{cx:p[0],cy:p[1],r:8,fill:C.ivory},svg);
  if(kind=='half'){E('circle',{cx:p[0],cy:p[1],r:8,fill:C.bg,stroke:C.sand,'stroke-width':1.6},svg);E('path',{d:'M'+p[0]+' '+(p[1]-8)+'A8 8 0 0 0 '+p[0]+' '+(p[1]+8)+'Z',fill:C.sand},svg)}
  if(kind=='ring')E('circle',{cx:p[0],cy:p[1],r:8,fill:C.bg,stroke:C.mist,'stroke-width':1.6},svg);
  tx(p[0]+dx,p[1]+dy,l1,'lg-t',an,'font-size:'+fs+'px');tx(p[0]+dx,p[1]+dy+lh,l2,'lg-d',an,'font-size:'+fd+'px')}
 var o1=cp?30:34;
 node(.03,'full','Análisis de datos','Práctica actual',-4,o1,'start');
 if(cp)node(.55,'half','Ciencia de datos aplicada','En formación',-14,-42,'end');else node(.55,'half','Ciencia de datos aplicada','En formación',16,o1,'start');
 node(.97,'ring','ML e IA aplicada','Dirección',4,cp?-40:-46,'end');
 [[.18,'PARADIGM'],[.37,'PROVIDENTIA'],[.76,'DECERNO']].forEach(function(q){var p=pt(q[0]);
  E('rect',{x:p[0]-4.5,y:p[1]-4.5,width:9,height:9,transform:'rotate(45 '+p[0]+' '+p[1]+')',fill:C.warm},svg);
  tx(p[0]-10,p[1]-14,q[1],'ax','end','font-size:'+(cp?11.5:12.5)+'px;fill:#F0D3A4')})
}

function run(){
 document.querySelectorAll('svg[data-fig]').forEach(function(s){
  var k=s.dataset.fig;
  if(k=='surface'){var p=JSON.parse(JSON.stringify(PRE[s.dataset.p]));if(s.dataset.o){var o=JSON.parse(s.dataset.o);for(var q in o)p[q]=o[q]}surface(s,p)}
  else if(k=='fan')fan(s);else if(k=='mosaic')mosaic(s);else if(k=='dist')dist(s);else if(k=='forest')forest(s);
  else if(k=='seam')seam(s);else if(k=='glyph')glyph(s,s.dataset.g);else if(k=='mono')mono(s);else if(k=='contour')contour(s);else if(k=='rain')rain(s);else if(k=='route')route(s);
 });
}
if(document.readyState!='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
