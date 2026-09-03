const KEY='waterMagicState';
const DEFAULT={goal:1700,total:0,history:[],plantLevel:0,lastDate:null,reminders:[
 {time:'10:30',text:'🌱 Доброе утро! Я проснулась. Давай немного водички?',enabled:true},
 {time:'12:00',text:'💧 Псс… Я уже немного хочу пить 🌱',enabled:true},
 {time:'14:00',text:'🌿 Время меня полить! Обещаю стать красивее 💚',enabled:true},
 {time:'16:00',text:'🥺 Кажется, моя земля становится сухой…',enabled:true},
 {time:'18:00',text:'💦 Ещё стаканчик — и я буду очень довольна!',enabled:true},
 {time:'20:30',text:'🌸 Ты сегодня хорошо обо мне заботишься!',enabled:true},
 {time:'23:00',text:'🌙 Перед вечерними делами не забудь про меня 💧',enabled:true},
 {time:'01:00',text:'✨ Последний глоточек для меня перед сном?',enabled:true}
]};
let state=load();
function load(){try{return {...DEFAULT,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...DEFAULT}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function resetIfNeeded(){if(state.lastDate!==today()){state.total=0;state.history=[];state.lastDate=today();save()}}
resetIfNeeded();
const $=s=>document.querySelector(s);
function render(){
 const pct=Math.min(100,Math.round(state.total/state.goal*100));
 $('#waterAmount').textContent=state.total;$('#goalAmount').textContent=state.goal;$('#percent').textContent=pct+'%';$('#progressFill').style.width=pct+'%';
 const plant=$('#plant');plant.className='plant '+(pct<20?'state-dry':pct<45?'state-thirsty':pct<80?'state-happy':'state-bloom');
 let msg=pct<20?'🥺 Мне очень хочется пить…':pct<45?'🌱 Мне уже лучше, но я всё ещё жду водичку.':pct<70?'🌿 Спасибо! Я оживаю.':pct<100?'🌸 Ещё немного — и я зацвету!':'✨ Как же мне хорошо! Я расцвело!';
 $('#plantMessage').textContent=msg;$('#statusText').textContent=pct>=100?'Сегодняшняя цель выполнена! 🌸':`До цели осталось ${Math.max(0,state.goal-state.total)} мл`;
 const drops=$('#drops');drops.innerHTML='';const count=Math.ceil(state.goal/100);for(let i=0;i<count;i++){const d=document.createElement('span');d.className='drop '+(i*100<state.total?'filled':'');drops.appendChild(d)}
}
function addWater(amount){amount=Math.max(1,Math.round(Number(amount)||0));state.total+=amount;state.history.push({amount,time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit')});state.plantLevel=Math.min(30,state.plantLevel+(amount>=state.goal*.5?2:1));save();render();animateWater();}
function animateWater(){const p=$('#plant');p.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(-9px) scale(1.04)'},{transform:'translateY(0) scale(1)'}],{duration:650,easing:'ease-out'});$('#sparkles').animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],{duration:900});}
document.querySelectorAll('.quick-add button').forEach(b=>b.addEventListener('click',()=>addWater(b.dataset.amount)));
$('#customBtn').onclick=()=>{$('#customModal').classList.remove('hidden');$('#customInput').focus()};$('#addCustom').onclick=()=>{const v=$('#customInput').value;if(v){addWater(v);$('#customModal').classList.add('hidden');$('#customInput').value=''}};
$('#settingsBtn').onclick=()=>{$('#goalInput').value=state.goal;$('#settingsModal').classList.remove('hidden')};$('#saveGoal').onclick=()=>{state.goal=Math.max(500,Number($('#goalInput').value)||1700);save();render();$('#settingsModal').classList.add('hidden')};
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>x.closest('.modal').classList.add('hidden')));
$('#notifyBtn').onclick=async()=>{if(!('Notification'in window)){alert('Этот браузер не поддерживает уведомления.');return}const p=await Notification.requestPermission();if(p==='granted'){new Notification('🌱 Моё растение',{body:'Напоминания включены. Я буду звать тебя пить воду 💧'});$('#notifyBtn').textContent='🔔 Напоминания включены'}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
function checkReminder(){const now=new Date(),hh=String(now.getHours()).padStart(2,'0'),mm=String(now.getMinutes()).padStart(2,'0'),t=hh+':'+mm;const r=state.reminders.find(x=>x.enabled&&x.time===t);if(r&&Notification.permission==='granted'){new Notification('🌱 Моё растение',{body:r.text,icon:'/icon.svg'});}}
setInterval(checkReminder,30000);render();
