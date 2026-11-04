const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function card(){
  const registry=new Map();const storage=new Map();
  class Element{attachShadow(){this.shadowRoot={addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}};return this.shadowRoot;}}
  const context={HTMLElement:Element,Image:class{},window:{},document:{},customElements:{get:k=>registry.get(k),define:(k,v)=>registry.set(k,v)},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console,Date,Number,String,Object,Map,Math,JSON,Promise,setTimeout,clearTimeout,CustomEvent:class{constructor(type,args){this.type=type;Object.assign(this,args)}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/antarikfox-atmosphere.js'),'utf8'),context);
  const C=registry.get('antarikfox-atmosphere'),c=new C();c._build=()=>{c._built=true};c._apply=()=>{};c._live=()=>{};c._renderHistory=()=>{};
  return{c,C};
}
test('blank public card can be configured without household entity IDs',()=>{const{c}=card();assert.doesNotThrow(()=>c.setConfig({}));assert.equal(c._cfg.temperature_entity,'');assert.equal(c._cfg.humidity_entity,'');assert.equal(c._cfg.room,'Комната');});
test('configuration validates paired entities and comfort bounds',()=>{const{c}=card();c.setConfig({room:'Кабинет',temperature_entity:'desk_temperature',humidity_entity:'desk_humidity'});assert.equal(c._cfg.temperature_entity,'sensor.desk_temperature');assert.throws(()=>c.setConfig({temperature_entity:'light.desk',humidity_entity:'sensor.humidity'}));assert.throws(()=>c.setConfig({temperature_entity:'sensor.same',humidity_entity:'sensor.same'}));assert.throws(()=>c.setConfig({comfort_tmin:30,comfort_tmax:20}));});
test('picker discovers existing sensors from their device classes',()=>{const{C}=card();const s=C.getStubConfig({states:{'sensor.t':{attributes:{device_class:'temperature'}},'sensor.h':{attributes:{device_class:'humidity'}}}});assert.equal(s.temperature_entity,'sensor.t');assert.equal(s.humidity_entity,'sensor.h');});
test('numeric zero differs from unavailable; Fahrenheit converts to Celsius',()=>{const{c}=card();c.setConfig({temperature_entity:'sensor.t',humidity_entity:'sensor.h'});c._hass={states:{'sensor.t':{state:'32',attributes:{unit_of_measurement:'°F'}},'sensor.h':{state:'0',attributes:{}}}};assert.equal(c._state('t').v,0);assert.equal(c._state('h').v,0);c._hass.states['sensor.t'].state='unavailable';assert.equal(c._state('t').v,null);c._hass.states['sensor.h'].state='101';assert.equal(c._state('h').v,null);});
test('compressed history preserves unavailable gaps and baseline intervals',()=>{const{c}=card();c.setConfig({});const rows=c._normalize([{lu:1,s:'20'},{lu:2,s:'unavailable'},{lu:3,s:'25'}],1000,5000,'t');assert.deepEqual(Array.from(rows,r=>r.v),[20,null,25]);assert.deepEqual(Array.from(rows,r=>r.end),[2000,3000,5000]);});
test('blank configuration never makes a history request',async()=>{const{c}=card();c.setConfig({});c._hass={callWS(){throw Error('must not call HA without sensors')}};await c._loadHistory();assert.match(c._historyError,/выбери/);});
test('history errors are displayed without rejecting interaction',async()=>{const{c}=card();c.setConfig({temperature_entity:'sensor.t',humidity_entity:'sensor.h'});c._hass={states:{},callWS:async()=>{throw Error('Recorder unavailable')}};await c._loadHistory(true);assert.equal(c._loading,false);assert.match(c._historyError,/Recorder unavailable/);});
