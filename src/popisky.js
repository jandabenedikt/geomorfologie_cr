const {feats}=require('./dekodovani.js');const {PROV,SUB,U}=require('./jednotky.js');
const by=Object.fromEntries(feats.map(f=>[f.id,f]));
const K=Math.cos(49.8*Math.PI/180);
const inR=(p,r)=>{let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const[xi,yi]=r[i],[xj,yj]=r[j];if((yi>p[1])!=(yj>p[1])&&p[0]<(xj-xi)*(p[1]-yi)/(yj-yi)+xi)c=!c;}return c;};
function segD(p,a,b){const ax=a[0]*K,ay=a[1],bx=b[0]*K,by=b[1],px=p[0]*K,py=p[1];const dx=bx-ax,dy=by-ay;let t=((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1);t=Math.max(0,Math.min(1,t));return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function pole(rings){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;rings.flat().forEach(([x,y])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);});
 let best=null,bd=-1;const N=60;for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const p=[x0+(x1-x0)*i/N,y0+(y1-y0)*j/N];if(!rings.reduce((c,r)=>c^inR(p,r),0))continue;let d=1e9;for(const r of rings)for(let k=0;k<r.length-1;k++)d=Math.min(d,segD(p,r[k],r[k+1]));if(d>bd){bd=d;best=p;}}
 return best.map(v=>+v.toFixed(3));}
const out={};
for(const s of SUB) out[s.id]=pole(by[s.id].rings);
for(const p of PROV){ // pole in largest member
 const big=p.geo.map(g=>by[g]).sort((a,b)=>b.rings[0].length-a.rings[0].length)[0]; out[p.id]=pole(p.geo.length>1? by[{P1:'S02',P2:'S09'}[p.id]].rings : big.rings);}
U.forEach((u,i)=>out['U'+i]=pole(by[u[2]].rings));
module.exports=out;
