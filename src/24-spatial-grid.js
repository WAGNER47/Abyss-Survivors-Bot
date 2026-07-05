/* ===== SPATIAL GRID ===== */
const GRID=BAL.cellSize;let grid=new Map();
const cellKey=(cx,cy)=>cx+','+cy;
function buildGrid(){grid.clear();let pi=0;for(const e of enemies){if(e._dead)continue;e._pi=pi++;const k=cellKey(Math.floor(e.x/GRID),Math.floor(e.y/GRID));let a=grid.get(k);if(!a){a=[];grid.set(k,a);}a.push(e);}}
function queryNear(x,y,r){const out=[],c0=Math.floor((x-r)/GRID),c1=Math.floor((x+r)/GRID),r0=Math.floor((y-r)/GRID),r1=Math.floor((y+r)/GRID);for(let cx=c0;cx<=c1;cx++)for(let cy=r0;cy<=r1;cy++){const a=grid.get(cellKey(cx,cy));if(a)for(let i=0;i<a.length;i++)out.push(a[i]);}return out;}
function nearestEnemy(x,y,maxR,exclude){const R=maxR||Math.max(W,H)*0.75;let best=null,bd=R*R;for(const e of queryNear(x,y,R)){if(e._dead)continue;if(exclude&&exclude.has(e))continue;const d=dist2(x,y,e.x,e.y);if(d<bd){bd=d;best=e;}}if(!best&&!maxR){bd=Infinity;for(const e of enemies){if(e._dead)continue;const d=dist2(x,y,e.x,e.y);if(d<bd){bd=d;best=e;}}}return best;}

