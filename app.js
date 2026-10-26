(async()=>{
const $=id=>document.getElementById(id);
const defaults={name:'',message:'Bu pastayı senin için hazırladım. İyi ki doğdun, iyi ki varsın. ♡',from:'Seni seven birinden ♡'};
let data={...defaults}, blown=false, stream=null, context=null, frame=null, timeout=null, listening=false;
async function encodeGift(payload){
 const bytes=new TextEncoder().encode(JSON.stringify(payload));
 let packed=bytes,format='b';
 if(typeof CompressionStream!=='undefined'){
  const compressed=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  if(compressed.length<bytes.length){packed=compressed;format='z';}
 }
 const code=btoa(Array.from(packed,b=>String.fromCharCode(b)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 return format+code;
}
async function decodeGift(code){
 if(code.length>20000)throw new Error('Link çok uzun');
 const format=code[0],encoded=code.slice(1).replaceAll('-','+').replaceAll('_','/');
 const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
 let decoded=bytes;
 if(format==='z'){
  if(typeof DecompressionStream==='undefined')throw new Error('Bu link için güncel bir tarayıcı gerekiyor');
  const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20000){await reader.cancel();throw new Error('Geçersiz link');}chunks.push(value);}
  decoded=new Uint8Array(size);let offset=0;for(const chunk of chunks){decoded.set(chunk,offset);offset+=chunk.length;}
 }else if(format!=='b')throw new Error('Geçersiz link');
 return JSON.parse(new TextDecoder().decode(decoded));
}
try{
 const hash=location.hash.slice(1),old=new URLSearchParams(hash).get('gift');
 const parsed=hash.startsWith('v2.')?await decodeGift(hash.slice(3)):old?JSON.parse(old):null;
 if(parsed)for(const key of ['name','message','from'])if(typeof parsed[key]==='string')data[key]=parsed[key].slice(0,key==='message'?1200:60);
}catch{ $('status').textContent='Hediye linki açılamadı. Linkin tamamını kopyalayıp güncel bir tarayıcıda tekrar dene.';}
$('name').textContent=data.name?' '+data.name:'';$('message').textContent=data.message;$('signature').textContent=data.from;document.title=`İyi ki doğdun${data.name ? ", " + data.name : ""} ♡`;
const form=$('form');for(const key of ['name','message','from'])form.elements[key].value=data[key]===defaults[key]&&key!=='message'?'':data[key];
function stopMic(){listening=false;cancelAnimationFrame(frame);clearTimeout(timeout);stream?.getTracks().forEach(track=>track.stop());stream=null;if(context){context.close().catch(()=>{});context=null;}$('blow').disabled=false;}
function burstConfetti(){
 const colors=['#e7ad6b','#d57877','#f8dfad','#b8b9d0','#c08d50'];
 for(let side=0;side<2;side++)for(let i=0;i<100;i++){
  const bit=document.createElement('i');bit.className='confetti burst'+(i%5===0?' glitter-piece':'');
  const direction=side===0?1:-1;
  const duration=2600+Math.random()*2400;
  const delay=Math.random()*280;
  // Each piece has its own launch angle, speed and flight time.
  const distance=innerWidth*(.12+Math.random()*.85)*direction;
  const lift=innerHeight*(.12+Math.random()*.65);
  const endY=innerHeight*(.45+Math.random()*.65);
  bit.style.cssText=`left:${side===0?'-2':'102'}%;top:${64+Math.random()*20}%;background:${colors[i%colors.length]};width:${4+Math.random()*5}px;height:${5+Math.random()*8}px;--dx:${distance}px;--dy:${-lift}px;--end-y:${endY}px;--turn:${direction*(360+Math.random()*1080)}deg;--sway:${(Math.random()-.5)*120}px;animation-delay:${delay}ms;animation-duration:${duration}ms;border-radius:${i%3===0?'50%':'1px'}`;
  document.body.append(bit);setTimeout(()=>bit.remove(),duration+delay+100);
 }
}
function celebrate(){
 if(blown)return;blown=true;stopMic();
 $('gift').classList.add('is-blown');$('cake').setAttribute('aria-label','Mumlar söndü.');$('ritual').hidden=true;
 burstConfetti();
 setTimeout(()=>{$('letter').hidden=false;},750);
}
$('cake').onclick=celebrate;$('touch').onclick=celebrate;
$('replay').onclick=()=>{stopMic();blown=false;$('gift').classList.remove('is-blown');$('letter').hidden=true;$('ritual').hidden=false;$('status').textContent='Sesin kaydedilmez, yalnızca üflemeni algılamak için kullanılır.';$('cake').setAttribute('aria-label','Mumları söndür');};
$('blow').onclick=async()=>{
 if(blown||listening)return;
 if(!navigator.mediaDevices?.getUserMedia){$('status').textContent='Mikrofon burada kullanılamıyor. Pastaya dokunarak dileğini gönder.';return;}
 listening=true;$('blow').disabled=true;$('status').textContent='Açılan pencerede mikrofon iznini ver.';
 try{const acquired=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});if(blown||!listening){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;context=new (window.AudioContext||window.webkitAudioContext)();await context.resume();const analyser=context.createAnalyser();analyser.fftSize=1024;context.createMediaStreamSource(stream).connect(analyser);const samples=new Float32Array(analyser.fftSize);let start=performance.now(),noiseSamples=[],threshold=.018,strongMs=0,lastTime=start;const tick=()=>{if(!listening)return;analyser.getFloatTimeDomainData(samples);const rms=Math.sqrt(samples.reduce((sum,v)=>sum+v*v,0)/samples.length);const now=performance.now(),elapsed=Math.min(50,now-lastTime);lastTime=now;if(now-start<650){noiseSamples.push(rms);$('status').textContent='Kısacık bekle, sonra üfle';}else{if(noiseSamples.length){noiseSamples.sort((a,b)=>a-b);const noise=noiseSamples[Math.floor(noiseSamples.length*.2)];threshold=Math.max(.012,Math.min(.04,noise*1.7+.004));noiseSamples=[];}$('status').textContent='Şimdi üfle · Telefonun altındaki mikrofona doğru';strongMs=rms>threshold?strongMs+elapsed:Math.max(0,strongMs-elapsed*.65);if(strongMs>=120){celebrate();return;}}frame=requestAnimationFrame(tick);};tick();timeout=setTimeout(()=>{stopMic();$('status').textContent='Mumlar biraz inatçı. Tekrar dene ya da pastaya dokun.';},14000);
 }catch{stopMic();if(!blown)$('status').textContent='Mikrofon açılamadı. Pastaya dokun, sihir devam etsin.';}
};
$('edit').onclick=()=>{stopMic();$('editor').showModal();};$('close').onclick=()=>$('editor').close();
form.onsubmit=async e=>{e.preventDefault();const payload={name:form.elements.name.value.trim()||defaults.name,message:form.elements.message.value.trim()||defaults.message,from:form.elements.from.value.trim()||defaults.from};const url=new URL(location.href);url.hash='v2.'+await encodeGift(payload);$('gift-link').value=url.href;$('link-area').hidden=false;$('editor-status').textContent='Link hazır! Göndermeden önce yeni bir sekmede açıp deneyebilirsin.';};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('gift-link').value);$('editor-status').textContent='Kopyalandı. Şimdi sevdiğin birine gönder ♡';}catch{$('gift-link').select();$('editor-status').textContent='Linki seçtik. Kopyalamak için Ctrl+C veya telefonun kopyala menüsünü kullan.';}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMic();});window.addEventListener('pagehide',stopMic);

// Quiet, ambient sparkle behind the celebration.
for(let i=0;i<32;i++){
 const star=document.createElement('span');star.className='ambient-star';
 star.textContent=i%4===0?'✧':'·';
 star.style.cssText=`left:${3+Math.random()*94}%;top:${5+Math.random()*90}%;--delay:${-Math.random()*8}s;--duration:${3+Math.random()*5}s;font-size:${i%4===0?10+Math.random()*10:12+Math.random()*14}px`;
 $('starlight').append(star);
}

})();
