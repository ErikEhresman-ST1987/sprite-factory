let animationReady=false,animationPlaying=false,animationFrame=0,animationLast=0,animationRaf=0,animationSize=256,animationCount=0;
const $=id=>document.getElementById(id);let source=null,downloadUrl=null;const mode=()=>document.querySelector('input[name="mode"]:checked').value;function updateMode(){if($('sheetDiagnostics'))$('sheetDiagnostics').hidden=true;if($('componentDiagnostics'))$('componentDiagnostics').hidden=true;stopAnimation();$('animationPanel').hidden=true;animationReady=false;const bg=mode()==='background',sheet=mode()==='sheet';$('spriteSettings').hidden=bg||sheet;$('backgroundSettings').hidden=!bg;$('sheetSettings').hidden=!sheet;$('settingsHeading').textContent=sheet?'Prepare sprite sheet':bg?'Prepare background':'Prepare sprite';$('modeHelp').textContent=sheet?'Animation frames in one horizontal row. One-row animation sheets with transparent WebP export.':bg?'Scenery that completely fills a game screen, without stretching.':'Transparent artwork for characters, objects, and items.';$('process').disabled=!source;$('download').hidden=true;$('status').textContent=source?'Ready: '+source.name:'Choose an image to begin.'}document.querySelectorAll('input[name="mode"]').forEach(el=>el.addEventListener('change',updateMode));function updateSheetSummary(){const n=Number($('sheetCount').value),s=Number($('sheetCellSize').value);$('sheetSummary').textContent=Number.isInteger(n)&&n>=2&&n<=16&&n*s<=4096?'Planned output: '+(n*s)+' × '+s+' pixels ('+n+' frames).':'Choose 2–16 frames with a total width no greater than 4096 pixels.'}for(const id of ['sheetCount','sheetCellSize','sheetAlignment','sheetExtraction'])$(id).addEventListener('input',updateSheetSummary);for(const id of ['sheetCount','sheetExtraction'])$(id).addEventListener('input',()=>{$('sheetDiagnostics').hidden=true;$('componentDiagnostics').hidden=true;});updateSheetSummary();$('bgPreset').addEventListener('change',()=>{const v=$('bgPreset').value;if(v!=='custom'){const [w,h]=v.split('x');$('bgWidth').value=w;$('bgHeight').value=h}});for(const id of ['bgWidth','bgHeight'])$(id).addEventListener('input',()=>{$('bgPreset').value='custom'});$('preset').addEventListener('change',()=>{const v=$('preset').value;if(v!=='custom'){$('width').value=v;$('height').value=v}});for(const id of ['width','height'])$(''+id).addEventListener('input',()=>{$('preset').value='custom'});$('coverage').addEventListener('input',()=>{$('coverageValue').textContent=$('coverage').value+'%'});$('tolerance').addEventListener('input',()=>{$('tol').textContent=$('tolerance').value});function handleArtworkSelection(e){stopAnimation();$('animationPanel').hidden=true;animationReady=false;source=e.target.files[0]||null;e.target.value='';if(downloadUrl){URL.revokeObjectURL(downloadUrl);downloadUrl=null;}$('download').hidden=true;$('download').removeAttribute('href');$('diagnoseSheet').disabled=!source;$('detectCharacters').disabled=!source;$('sheetDiagnostics').hidden=true;$('componentDiagnostics').hidden=true;$('process').disabled=!source;$('status').textContent=source?'Ready: '+source.name:'Select an image.';const oldPicker=e.target;const freshPicker=oldPicker.cloneNode(false);oldPicker.replaceWith(freshPicker);freshPicker.addEventListener('change',handleArtworkSelection);} $('file').addEventListener('change',handleArtworkSelection);$('process').addEventListener('click',async()=>{if(!source)return;stopAnimation();$('animationPanel').hidden=true;animationReady=false;$('process').disabled=true;$('download').hidden=true;try{if(mode()==='background'){await createBackground();return;}if(mode()==='sheet'){await createSheet();return;}const bmp=await createImageBitmap(source);const raw=document.createElement('canvas');raw.width=bmp.width;raw.height=bmp.height;const rc=raw.getContext('2d',{willReadFrequently:true});rc.drawImage(bmp,0,0);bmp.close();const im=rc.getImageData(0,0,raw.width,raw.height),d=im.data,w=raw.width,h=raw.height,t=Number($('tolerance').value),seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;function add(x,y){if(x<0||y<0||x>=w||y>=h)return;const p=y*w+x;if(seen[p])return;seen[p]=1;const k=p*4;if(d[k]>=255-t&&d[k+1]>=255-t&&d[k+2]>=255-t)queue[tail++]=p;}for(let x=0;x<w;x++){add(x,0);add(x,h-1)}for(let y=0;y<h;y++){add(0,y);add(w-1,y)}while(head<tail){const p=queue[head++],k=p*4;d[k+3]=0;const x=p%w,y=(p/w)|0;add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1)}if($('enclosedWhite').checked)removeEnclosedWhite(d,w,h,t);if($('edgeCleanup').checked){const original=new Uint8ClampedArray(d);let softened=0;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x,k=p*4;if(original[k+3]===0)continue;const neighbors=[p-1,p+1,p-w,p+w];if(!neighbors.some(n=>original[n*4+3]===0))continue;const low=Math.min(original[k],original[k+1],original[k+2]);if(low<215)continue;const strength=Math.min(.85,Math.max(0,(low-215)/40));const next=Math.round(original[k+3]*(1-strength));if(next<original[k+3]){d[k+3]=next;softened++}}}rc.putImageData(im,0,0);const ow=Number($('width').value),oh=Number($('height').value);if(!Number.isInteger(ow)||!Number.isInteger(oh)||ow<1||oh<1||ow>4096||oh>4096)throw Error('Output dimensions must be 1–4096 pixels.');const canvas=$('preview');canvas.width=ow;canvas.height=oh;const c=canvas.getContext('2d');c.clearRect(0,0,ow,oh);let sx=0,sy=0,sw=w,sh=h;if($('autoCrop').checked){let minX=w,minY=h,maxX=-1,maxY=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(d[(y*w+x)*4+3]<16)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}if(maxX<0)throw Error('No visible subject found for automatic cropping.');sx=minX;sy=minY;sw=maxX-minX+1;sh=maxY-minY+1;}let dw=ow,dh=oh,dx=0,dy=0;if($('fit').checked||$('autoCrop').checked){const coverage=$('autoCrop').checked?Number($('coverage').value)/100:1;const scale=Math.min(ow*coverage/sw,oh*coverage/sh);dw=sw*scale;dh=sh*scale;dx=(ow-dw)/2;dy=(oh-dh)/2}c.drawImage(raw,sx,sy,sw,sh,dx,dy,dw,dh);$('status').textContent='Encoding WebP…';let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.95));let encoder='browser';if(!blob||blob.type!=='image/webp'){encoder='WebAssembly';$('status').textContent='Loading WebP encoder for this browser…';const codec=await import('https://esm.sh/@jsquash/webp@1.5.0');const buffer=await codec.encode(c.getImageData(0,0,ow,oh));blob=new Blob([buffer],{type:'image/webp'});}const bytes=new Uint8Array(await blob.slice(0,12).arrayBuffer());const tag=(a,b)=>String.fromCharCode(...bytes.slice(a,b));if(tag(0,4)!=='RIFF'||tag(8,12)!=='WEBP')throw Error('Output is not a valid WebP container.');const test=await createImageBitmap(blob);if(test.width!==ow||test.height!==oh){test.close();throw Error('Encoded image dimensions do not match.');}const check=document.createElement('canvas');check.width=ow;check.height=oh;const ctx=check.getContext('2d',{willReadFrequently:true});ctx.drawImage(test,0,0);test.close();const pixels=ctx.getImageData(0,0,ow,oh).data;let transparent=false,opaque=false;for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)transparent=true;if(pixels[i]>0)opaque=true;if(transparent&&opaque)break;}if(!transparent||!opaque)throw Error('Encoded image did not retain both transparent and visible pixels.');if(downloadUrl)URL.revokeObjectURL(downloadUrl);downloadUrl=URL.createObjectURL(blob);$('download').href=downloadUrl;$('download').download=source.name.replace(/\.[^.]+$/,'')+'-sprite.webp';$('download').hidden=false;$('status').textContent='Export verified ('+encoder+'): WebP with transparency, '+ow+' × '+oh+'; '+Math.round(blob.size/1024)+' KB. Inspect edges visually.';}catch(err){$('status').textContent='Test failed: '+err.message;}finally{$('process').disabled=!source}});
function removeEnclosedWhite(data,width,height,tolerance){
 const count=width*height,visited=new Uint8Array(count),queue=new Int32Array(count);
 const limit=255-tolerance;
 for(let start=0;start<count;start++){
  if(visited[start])continue;
  const k=start*4;
  if(data[k+3]===0||data[k]<limit||data[k+1]<limit||data[k+2]<limit)continue;
  let head=0,tail=1;
  queue[0]=start;
  visited[start]=1;
  while(head<tail){
   const p=queue[head++],x=p%width,y=Math.floor(p/width);
   const neighbors=[x>0?p-1:-1,x+1<width?p+1:-1,y>0?p-width:-1,y+1<height?p+width:-1];
   for(const n of neighbors){
    if(n<0||visited[n])continue;
    visited[n]=1;
    const j=n*4;
    if(data[j+3]!==0&&data[j]>=limit&&data[j+1]>=limit&&data[j+2]>=limit)queue[tail++]=n;
   }
  }
  if(tail>=4)for(let i=0;i<tail;i++)data[queue[i]*4+3]=0;
 }
}

if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(regs=>Promise.all(regs.filter(r=>r.scope.startsWith(location.origin+location.pathname.replace(/[^/]*$/,''))).map(r=>r.unregister()))).catch(()=>{})}

async function createBackground(){
 const ow=Number($('bgWidth').value),oh=Number($('bgHeight').value);
 if(!Number.isInteger(ow)||!Number.isInteger(oh)||ow<1||oh<1||ow>4096||oh>4096)throw Error('Background dimensions must be 1–4096 pixels.');
 const bmp=await createImageBitmap(source);
 try{
  const canvas=$('preview');canvas.width=ow;canvas.height=oh;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.fillStyle='#ffffff';c.fillRect(0,0,ow,oh);
  const scale=Math.max(ow/bmp.width,oh/bmp.height),sw=ow/scale,sh=oh/scale;
  c.drawImage(bmp,(bmp.width-sw)/2,(bmp.height-sh)/2,sw,sh,0,0,ow,oh);
  $('status').textContent='Encoding background WebP…';
  let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.95));let encoder='browser';
  if(!blob||blob.type!=='image/webp'){
   encoder='WebAssembly';$('status').textContent='Loading WebP encoder…';
   const codec=await import('https://esm.sh/@jsquash/webp@1.5.0');
   blob=new Blob([await codec.encode(c.getImageData(0,0,ow,oh))],{type:'image/webp'});
  }
  const bytes=new Uint8Array(await blob.slice(0,12).arrayBuffer());
  const tag=(a,b)=>String.fromCharCode(...bytes.slice(a,b));
  if(tag(0,4)!=='RIFF'||tag(8,12)!=='WEBP')throw Error('Output is not a genuine WebP.');
  const test=await createImageBitmap(blob);
  try{
   if(test.width!==ow||test.height!==oh)throw Error('Encoded dimensions do not match.');
   const check=document.createElement('canvas');check.width=ow;check.height=oh;
   const ctx=check.getContext('2d',{willReadFrequently:true});ctx.drawImage(test,0,0);
   const pixels=ctx.getImageData(0,0,ow,oh).data;
   for(let i=3;i<pixels.length;i+=4)if(pixels[i]!==255)throw Error('Background export contains transparent pixels.');
  }finally{test.close()}
  if(downloadUrl)URL.revokeObjectURL(downloadUrl);
  downloadUrl=URL.createObjectURL(blob);$('download').href=downloadUrl;
  $('download').download=source.name.replace(/\.[^.]+$/,'')+'-background.webp';
  $('download').hidden=false;
  $('status').textContent='Background verified ('+encoder+'): opaque WebP, '+ow+' × '+oh+'; '+Math.round(blob.size/1024)+' KB.';
 }finally{bmp.close()}
}

async function createSheet(){
 const n=Number($('sheetCount').value),size=Number($('sheetCellSize').value);
 if(!Number.isInteger(n)||n<2||n>16||![128,256,512].includes(size)||n*size>4096)throw Error('Choose 2–16 frames; total output width must not exceed 4096 pixels.');
 const bmp=await createImageBitmap(source);
 try{
  if(bmp.width<n*32||bmp.height<32)throw Error('Source artwork is too small for the selected frame count.');
  const src=document.createElement('canvas');src.width=bmp.width;src.height=bmp.height;
  const sc=src.getContext('2d',{willReadFrequently:true});sc.drawImage(bmp,0,0);
  const out=$('preview');out.width=n*size;out.height=size;const oc=out.getContext('2d');oc.clearRect(0,0,out.width,out.height);
  const subjects=[];const tolerance=35;const edgeWarnings=[];
  const components=$('sheetExtraction').value==='components';
  const smart=$('sheetExtraction').value==='smart';
  const cutResult=smart?findSmartCuts(sc,bmp.width,bmp.height,n):null;
  if(smart&&cutResult.unsafe.length)throw Error('Smart extraction cannot find a safe white gap at boundary '+cutResult.unsafe.join(', ')+'. No export created. Try a better-separated source or use Equal-width to compare.');
  const cuts=smart?cutResult.cuts:Array.from({length:n+1},(_,i)=>Math.round(i*bmp.width/n));
  if(components)subjects.push(...extractConnectedSubjects(sc,bmp.width,bmp.height,n));
  for(let i=0;i<(components?0:n);i++){
   const x0=cuts[i],x1=cuts[i+1],w=x1-x0,h=bmp.height;
   const frame=sc.getImageData(x0,0,w,h),d=frame.data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
   let head=0,tail=0;
   function visit(p){if(p<0||p>=w*h||seen[p])return;seen[p]=1;const k=p*4;if(d[k+3]<16||Math.min(d[k],d[k+1],d[k+2])>=255-tolerance)queue[tail++]=p;}
   for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x)}
   for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1)}
   while(head<tail){const p=queue[head++],k=p*4;d[k+3]=0;const x=p%w,y=(p/w)|0;if(x>0)visit(p-1);if(x+1<w)visit(p+1);if(y>0)visit(p-w);if(y+1<h)visit(p+w);}
   let left=w,right=-1,top=h,bottom=-1;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4;if(d[k+3]<16)continue;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
   if(right<left)throw Error('No visible artwork detected in frame '+(i+1)+'.');
   if(left===0||right===w-1)edgeWarnings.push(i+1);
   const fc=document.createElement('canvas');fc.width=w;fc.height=h;fc.getContext('2d').putImageData(frame,0,0);
   subjects.push({canvas:fc,left,right,top,bottom,w,h});
  }
  // One shared scale and a shared baseline prevent independent auto-crop jitter.
  const maxW=Math.max(...subjects.map(s=>s.right-s.left+1)),maxH=Math.max(...subjects.map(s=>s.bottom-s.top+1));
  const scale=Math.min(size*.88/maxW,size*.88/maxH),stationary=$('sheetAlignment').value==='stationary';
  // Estimate the stable torso position from opaque pixels in the middle body band.
  // Head, tail tips, and feet contribute less to the horizontal anchor.
  function bodyAnchor(s){
   const data=s.canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,s.w,s.h).data;
   const top=s.top+(s.bottom-s.top)*.35,bottom=s.top+(s.bottom-s.top)*.78;
   let sum=0,weight=0;
   for(let y=Math.ceil(top);y<=Math.floor(bottom);y+=2)for(let x=s.left;x<=s.right;x+=2){
    const a=data[(y*s.w+x)*4+3];if(a<96)continue;
    const v=a/255;sum+=x*v;weight+=v;
   }
   return weight?sum/weight:(s.left+s.right)/2;
  }
  const anchors=stationary?subjects.map(bodyAnchor):[];
  const globalTop=components&&stationary?Math.min(...subjects.map(s=>s.originY)):0;
  const globalBottom=components&&stationary?Math.max(...subjects.map(s=>s.originY+s.h)):0;
  const sharedVerticalScale=components&&stationary?size*.88/Math.max(1,globalBottom-globalTop):scale;
  // For component-based stationary animations, keep the source-image X offsets.
  // One shared translation preserves relative torso positions; never recenter by pose.
  const sourceCellWidth=bmp.width/n;
  const sourceOffsets=components&&stationary?subjects.map((s,i)=>s.originX-i*sourceCellWidth):[];
  const relativeLeft=components&&stationary?Math.min(...sourceOffsets):0;
  const relativeRight=components&&stationary?Math.max(...subjects.map((s,i)=>sourceOffsets[i]+s.w)):0;
  const sourceSpan=relativeRight-relativeLeft;
  const useScale=components&&stationary?Math.min(scale,sharedVerticalScale,size*.88/Math.max(1,sourceSpan)):scale;
  const sharedXOffset=components&&stationary?(size-sourceSpan*useScale)/2-relativeLeft*useScale:0;
  for(let i=0;i<n;i++){
   const s=subjects[i],width=(s.right-s.left+1)*useScale,height=(s.bottom-s.top+1)*useScale;
   const center=(s.left+s.right)/2,sourceCenter=s.w/2;
   const dx=components&&stationary?i*size+sharedXOffset+sourceOffsets[i]*useScale:stationary?i*size+size/2-(anchors[i]-s.left)*useScale:components?i*size+(size-width)/2:i*size+size/2+(center-sourceCenter)*useScale-width/2;
   // Connected stationary frames share the ORIGINAL source-image Y coordinates.
   // A grazing muzzle can pass below the hooves without moving the whole cow.
   const dy=components&&stationary?size*.06+(s.originY-globalTop)*useScale:size*.94-height;
   if(dx<i*size||dx+width>(i+1)*size||dy<0)throw Error('Frame '+(i+1)+' does not fit the output cell. Try a larger cell or artwork with more even framing.');
   oc.drawImage(s.canvas,s.left,s.top,s.right-s.left+1,s.bottom-s.top+1,dx,dy,width,height);
  }
  $('status').textContent='Encoding sprite sheet WebP…';
  let blob=await new Promise(resolve=>out.toBlob(resolve,'image/webp',.95)),encoder='browser';
  if(!blob||blob.type!=='image/webp'){encoder='WebAssembly';const codec=await import('https://esm.sh/@jsquash/webp@1.5.0');blob=new Blob([await codec.encode(oc.getImageData(0,0,out.width,out.height))],{type:'image/webp'});}
  const bytes=new Uint8Array(await blob.slice(0,12).arrayBuffer()),tag=(a,b)=>String.fromCharCode(...bytes.slice(a,b));
  if(tag(0,4)!=='RIFF'||tag(8,12)!=='WEBP')throw Error('Export is not a genuine WebP.');
  const verify=await createImageBitmap(blob);
  try{
   if(verify.width!==out.width||verify.height!==out.height)throw Error('Encoded dimensions differ from requested dimensions.');
   const check=document.createElement('canvas');check.width=out.width;check.height=out.height;const ctx=check.getContext('2d',{willReadFrequently:true});ctx.drawImage(verify,0,0);
   const data=ctx.getImageData(0,0,out.width,out.height).data;
   for(let f=0;f<n;f++){let visible=false,clear=false;for(let y=0;y<size;y++)for(let x=f*size;x<(f+1)*size;x++){const a=data[(y*out.width+x)*4+3];if(a>0)visible=true;if(a===0)clear=true;if(visible&&clear)break;}if(!visible||!clear)throw Error('Frame '+(f+1)+' failed transparency verification.');}
  }finally{verify.close();}
  if(downloadUrl)URL.revokeObjectURL(downloadUrl);downloadUrl=URL.createObjectURL(blob);
  $('download').href=downloadUrl;$('download').download=source.name.replace(/\.[^.]+$/,'')+'-sheet.webp';
  animationSize=size;animationCount=n;animationFrame=0;animationReady=true;$('animationCanvas').width=size;$('animationCanvas').height=size;$('animationPanel').hidden=false;drawAnimationFrame();$('download').hidden=false;
  $('status').textContent='Verified ('+encoder+'): '+n+' frames, '+size+' × '+size+' each; sheet '+out.width+' × '+out.height+' WebP ('+Math.round(blob.size/1024)+' KB). Inspect alignment and edges before using in PixiJS.'+(edgeWarnings.length?' Warning: artwork reaches a source cell edge in frame(s) '+edgeWarnings.join(', ')+'. Inspect for clipping.':'');
 }finally{bmp.close();}
}

function drawAnimationFrame(){
 if(!animationReady)return;
 const c=$('animationCanvas').getContext('2d');c.clearRect(0,0,animationSize,animationSize);
 c.drawImage($('preview'),animationFrame*animationSize,0,animationSize,animationSize,0,0,animationSize,animationSize);
}
function stopAnimation(){
 animationPlaying=false;if(animationRaf)cancelAnimationFrame(animationRaf);animationRaf=0;animationLast=0;
 const button=$('animationToggle');if(button)button.textContent='Play';
}
function animationTick(now){
 if(!animationPlaying)return;
 const delay=1000/Number($('animationFps').value);
 if(!animationLast)animationLast=now;
 if(now-animationLast>=delay){const steps=Math.floor((now-animationLast)/delay);animationFrame=(animationFrame+steps)%animationCount;animationLast+=steps*delay;drawAnimationFrame();}
 animationRaf=requestAnimationFrame(animationTick);
}
$('animationToggle').addEventListener('click',()=>{
 if(!animationReady)return;
 if(animationPlaying){stopAnimation();return;}
 animationPlaying=true;animationLast=0;$('animationToggle').textContent='Pause';animationRaf=requestAnimationFrame(animationTick);
});
$('animationFps').addEventListener('input',()=>{$('animationFpsValue').textContent=$('animationFps').value;animationLast=0;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimation();});

/* Increment 11A: read-only diagnostics; does not modify the export canvas or slicing. */
$('diagnoseSheet').addEventListener('click',async()=>{
 if(!source||mode()!=='sheet')return;
 const n=Number($('sheetCount').value),button=$('diagnoseSheet');
 if(!Number.isInteger(n)||n<2||n>16){$('sheetDiagnostics').hidden=false;$('diagnosticText').textContent='Choose a valid frame count (2–16).';return;}
 button.disabled=true;$('sheetDiagnostics').hidden=false;$('diagnosticText').textContent='Analyzing original image…';
 let bmp;
 try{
  bmp=await createImageBitmap(source);
  const work=document.createElement('canvas');work.width=bmp.width;work.height=bmp.height;
  const ctx=work.getContext('2d',{willReadFrequently:true});ctx.drawImage(bmp,0,0);
  const d=ctx.getImageData(0,0,bmp.width,bmp.height).data,w=bmp.width,hh=bmp.height;
  const counts=sourceInkCounts(d,w,hh);
  const view=$('diagnosticCanvas');view.width=w;view.height=hh;const v=view.getContext('2d');v.drawImage(bmp,0,0);
  const blocked=[];
  const smart=$('sheetExtraction').value==='smart';
  const proposal=smart?findSmartCuts(ctx,w,hh,n,counts):null;
  for(let i=1;i<n;i++){
   const x=smart?proposal.cuts[i]:Math.round(i*w/n),half=Math.max(2,Math.round(w/n*.015));
   let min=Infinity;
   for(let xx=Math.max(0,x-half);xx<=Math.min(w-1,x+half);xx++)min=Math.min(min,counts[xx]);
   if(smart?proposal.unsafe.includes(i):min>1)blocked.push(i);
   v.beginPath();v.moveTo(x+.5,0);v.lineTo(x+.5,hh);v.lineWidth=Math.max(2,w/650);v.strokeStyle=blocked.includes(i)?'#e33131':'#159447';v.stroke();
   v.fillStyle=blocked.includes(i)?'#e33131':'#159447';v.fillRect(x-11,0,22,23);
   v.font='bold 16px sans-serif';v.textAlign='center';v.fillStyle='#fff';v.fillText(String(i),x,17);
  }
  $('diagnosticText').textContent=blocked.length
   ?'Potential cut-through at '+blocked.length+' of '+(n-1)+' boundaries (red: '+blocked.join(', ')+'). '+(smart?'Smart mode will refuse export until all cuts are safe. ':'')+'Green indicates a near-empty vertical gap. This is a source-layout diagnostic, not a guarantee of correct separation.'
   :'No obvious cut-through detected at the '+(n-1)+' boundaries. '+(smart?'Smart mode proposed adjusted cut positions. ':'')+'Check the guides visually; thin details may still cross.';
 }catch(e){$('diagnosticText').textContent='Analysis failed: '+e.message;}
 finally{if(bmp)bmp.close();button.disabled=!source;}
});

/* Shared source-layout analysis. Only the experimental mode uses these cuts for export. */
function sourceInkCounts(data,w,h){
 const counts=new Uint32Array(w);
 for(let y=0;y<h;y+=2)for(let x=0;x<w;x++){
  const k=(y*w+x)*4;
  if(data[k+3]>64&&Math.min(data[k],data[k+1],data[k+2])<225)counts[x]++;
 }
 return counts;
}
function findSmartCuts(ctx,w,h,n,existingCounts){
 const counts=existingCounts||sourceInkCounts(ctx.getImageData(0,0,w,h).data,w,h);
 const cell=w/n,search=Math.max(2,Math.floor(cell*.24)),radius=Math.max(2,Math.floor(cell*.012));
 const cuts=[0],unsafe=[];
 for(let i=1;i<n;i++){
  const expected=Math.round(i*cell);
  const lo=Math.max(cuts[i-1]+Math.floor(cell*.55),expected-search);
  const hi=Math.min(w-Math.ceil((n-i)*cell*.55),expected+search);
  let best=expected,bestScore=Infinity,bestInk=Infinity;
  for(let x=lo;x<=hi;x++){
   let ink=0;
   for(let k=Math.max(0,x-radius);k<=Math.min(w-1,x+radius);k++)ink+=counts[k];
   const score=ink+Math.abs(x-expected)*.015;
   if(score<bestScore){bestScore=score;best=x;bestInk=ink;}
  }
  cuts.push(best);
  // No visible pixels in the narrow neighborhood is the conservative safety criterion.
  if(bestInk>0)unsafe.push(i);
 }
 cuts.push(w);
 return {cuts,unsafe};
}

/* Increment 11C: read-only connected foreground diagnostics. Export remains unchanged. */
$('detectCharacters').addEventListener('click',async()=>{
 if(!source||mode()!=='sheet')return;
 const button=$('detectCharacters'),n=Number($('sheetCount').value);
 if(!Number.isInteger(n)||n<2||n>16)return;
 button.disabled=true;$('componentDiagnostics').hidden=false;
 $('componentText').textContent='Detecting connected foreground regions…';
 let bmp;
 try{
  bmp=await createImageBitmap(source);
  const w=bmp.width,h=bmp.height,canvas=document.createElement('canvas');
  if(w*h>10000000)throw Error('Image too large for character diagnostics (10 million pixels maximum).');
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bmp,0,0);
  const pixels=ctx.getImageData(0,0,w,h).data,mask=new Uint8Array(w*h);
  // Conservative dark-foreground threshold against white or near-white source.
  for(let p=0;p<mask.length;p++){
   const k=p*4;
   if(pixels[k+3]>64&&Math.min(pixels[k],pixels[k+1],pixels[k+2])<225)mask[p]=1;
  }
  const seen=new Uint8Array(mask.length),stack=new Int32Array(mask.length),regions=[];
  for(let p=0;p<mask.length;p++){
   if(!mask[p]||seen[p])continue;
   let top=0;stack[top++]=p;seen[p]=1;
   let count=0,minX=w,minY=h,maxX=0,maxY=0;
   while(top){
    const q=stack[--top],x=q%w,y=(q/w)|0;
    count++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
    for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++){
     for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){
      const z=yy*w+xx;
      if(mask[z]&&!seen[z]){seen[z]=1;stack[top++]=z;}
     }
    }
   }
   if(count>=Math.max(100,Math.floor(w*h*.0003)))regions.push({count,minX,minY,maxX,maxY});
  }
  regions.sort((a,b)=>a.minX-b.minX);
  const view=$('componentCanvas');view.width=w;view.height=h;
  const v=view.getContext('2d');v.drawImage(bmp,0,0);
  v.lineWidth=Math.max(2,w/600);v.font='bold '+Math.max(16,Math.floor(w/85))+'px sans-serif';
  regions.forEach((r,i)=>{
   const hue=(i*67)%360;v.strokeStyle='hsl('+hue+' 85% 38%)';v.fillStyle=v.strokeStyle;
   v.strokeRect(r.minX,r.minY,r.maxX-r.minX+1,r.maxY-r.minY+1);
   const labelX=Math.max(0,Math.min(w-35,r.minX)),labelY=Math.max(25,r.minY-5);
   v.fillRect(labelX,labelY-24,32,25);v.fillStyle='#fff';v.fillText(String(i+1),labelX+7,labelY-5);
  });
  const detected=regions.length;
  $('componentText').textContent=detected+' substantial connected region(s) detected; '+n+' animation frames requested. '+
   (detected===n?'Counts match, but inspect every outline: matching counts do not prove correct separation.':
   'Counts differ. Some characters may touch, or a character may contain disconnected details.')+
   ' Colored boxes show connected regions, not guaranteed individual characters. No export was changed.';
 }catch(e){$('componentText').textContent='Detection failed: '+e.message;}
 finally{if(bmp)bmp.close();button.disabled=!source;}
});

function extractConnectedSubjects(ctx,w,h,n){
 const total=w*h;if(total>10000000)throw Error('Image too large for character extraction.');
 const data=ctx.getImageData(0,0,w,h).data,mask=new Uint8Array(total),seen=new Uint8Array(total),stack=new Int32Array(total);
 for(let p=0;p<total;p++){const k=p*4;if(data[k+3]>64&&Math.min(data[k],data[k+1],data[k+2])<225)mask[p]=1;}
 const regions=[];
 for(let p=0;p<total;p++){
  if(!mask[p]||seen[p])continue;
  let top=0,count=0,minX=w,minY=h,maxX=0,maxY=0;stack[top++]=p;seen[p]=1;const pixels=[];
  while(top){const q=stack[--top],x=q%w,y=(q/w)|0;pixels.push(q);count++;
   minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){
    const z=yy*w+xx;if(mask[z]&&!seen[z]){seen[z]=1;stack[top++]=z;}
   }
  }
  if(count>=Math.max(100,Math.floor(total*.0003)))regions.push({pixels,minX,minY,maxX,maxY});
 }
 regions.sort((a,b)=>a.minX-b.minX);
 if(regions.length!==n)throw Error('Detected '+regions.length+' connected characters for '+n+' frames. No export created; inspect detection outlines.');
 const owner=new Int16Array(total);owner.fill(-1);
 regions.forEach((r,i)=>r.pixels.forEach(p=>owner[p]=i));
 return regions.map((r,i)=>{
  const x0=Math.max(0,r.minX-2),y0=Math.max(0,r.minY-2),x1=Math.min(w-1,r.maxX+2),y1=Math.min(h-1,r.maxY+2),sw=x1-x0+1,sh=y1-y0+1;
  const fc=document.createElement('canvas');fc.width=sw;fc.height=sh;
  const context=fc.getContext('2d'),frame=context.createImageData(sw,sh),fd=frame.data,near=new Uint8Array(sw*sh);
  for(const p of r.pixels){const x=p%w,y=(p/w)|0;
   for(let yy=Math.max(y0,y-2);yy<=Math.min(y1,y+2);yy++)for(let xx=Math.max(x0,x-2);xx<=Math.min(x1,x+2);xx++){
    const global=yy*w+xx;if(owner[global]!==-1&&owner[global]!==i)continue;
    near[(yy-y0)*sw+xx-x0]=1;
   }
  }
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){
   const p=y*sw+x;if(!near[p])continue;
   const k=((y+y0)*w+x+x0)*4,t=p*4,dark=255-Math.min(data[k],data[k+1],data[k+2]);
   const alpha=Math.min(data[k+3],Math.round(dark*255/35));
   if(alpha<4)continue;
   fd[t]=data[k];fd[t+1]=data[k+1];fd[t+2]=data[k+2];fd[t+3]=alpha;
  }
  context.putImageData(frame,0,0);
  return {canvas:fc,left:0,right:sw-1,top:0,bottom:sh-1,w:sw,h:sh,originX:x0,originY:y0};
 });
}
