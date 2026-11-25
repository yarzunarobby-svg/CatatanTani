/**
 * BACKEND GOOGLE SHEETS - CATATANPETANI
 * Pasang pada Extensions > Apps Script dari Google Spreadsheet.
 * Ganti API_KEY, jalankan setupDatabase(), lalu deploy sebagai Web App.
 */
const API_KEY = "GANTI_DENGAN_KUNCI_ACAK_MINIMAL_16_KARAKTER";
const DB_PROPERTY = "CATATANPETANI_SPREADSHEET_ID";
const SYNC_PROPERTY = "CATATANPETANI_LAST_SYNC_ID";

const TABLES = {
  lands:{sheet:"Data_Lahan",headers:["id","name","location","area","ownership","soil","irrigation","notes","createdAt"]},
  seasons:{sheet:"Musim_Tanam",headers:["id","landId","crop","variety","startDate","plantingMethod","seedQty","seedUnit","targetYield","status","notes","createdAt"]},
  activities:{sheet:"Aktivitas",headers:["id","date","seasonId","stage","title","details","laborCount","duration","notes","createdAt"]},
  expenses:{sheet:"Biaya_Produksi",headers:["id","date","seasonId","category","description","quantity","unit","unitPrice","paidBy","notes","createdAt"]},
  stocks:{sheet:"Persediaan",headers:["id","name","category","quantity","unit","minStock","unitPrice","supplier","notes","createdAt"]},
  stockMoves:{sheet:"Mutasi_Stok",headers:["id","stockId","type","quantity","date","note"]},
  harvests:{sheet:"Hasil_Panen",headers:["id","date","seasonId","quantity","unit","quality","moisture","notes","createdAt"]},
  sales:{sheet:"Penjualan",headers:["id","date","seasonId","buyer","quantity","unit","unitPrice","paidAmount","paymentMethod","notes","createdAt"]}
};

function setupDatabase(){
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss) throw new Error("Buka Apps Script dari Google Spreadsheet.");
  PropertiesService.getScriptProperties().setProperty(DB_PROPERTY,ss.getId());
  Object.keys(TABLES).forEach(k=>{
    const d=TABLES[k]; let sh=ss.getSheetByName(d.sheet);
    if(!sh) sh=ss.insertSheet(d.sheet);
    sh.getRange(1,1,1,d.headers.length).setValues([d.headers]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,d.headers.length).setBackground("#285b91").setFontColor("#ffffff").setFontWeight("bold");
    sh.autoResizeColumns(1,d.headers.length);
  });
  SpreadsheetApp.flush();
  Logger.log("Database siap: "+ss.getUrl());
}

function doGet(e){
  const p=(e&&e.parameter)||{};
  if(!authorized_(p.key)) return output_(e,{ok:false,error:"Kunci akses tidak valid."});
  if(p.action!=="read") return output_(e,{ok:false,error:"Aksi GET tidak dikenal."});
  try{
    return output_(e,{
      ok:true,
      data:readDatabase_(),
      syncId:PropertiesService.getScriptProperties().getProperty(SYNC_PROPERTY)||""
    });
  }catch(err){return output_(e,{ok:false,error:String(err.message||err)});}
}

function doPost(e){
  let body;
  try{body=JSON.parse((e&&e.postData&&e.postData.contents)||"{}");}
  catch(err){return jsonOutput_({ok:false,error:"Format JSON tidak valid."});}
  if(!authorized_(body.key)) return jsonOutput_({ok:false,error:"Kunci akses tidak valid."});
  if(body.action!=="write"||!body.data||!body.syncId) return jsonOutput_({ok:false,error:"Payload tidak lengkap."});
  const lock=LockService.getScriptLock(); lock.waitLock(30000);
  try{
    writeDatabase_(body.data);
    PropertiesService.getScriptProperties().setProperty(SYNC_PROPERTY,String(body.syncId));
    SpreadsheetApp.flush();
    return jsonOutput_({ok:true,syncId:String(body.syncId)});
  }catch(err){return jsonOutput_({ok:false,error:String(err.message||err)});}
  finally{lock.releaseLock();}
}

function authorized_(provided){
  return API_KEY && API_KEY!=="GANTI_DENGAN_KUNCI_ACAK_MINIMAL_16_KARAKTER" && String(provided||"")===API_KEY;
}
function getSpreadsheet_(){
  const id=PropertiesService.getScriptProperties().getProperty(DB_PROPERTY);
  if(!id) throw new Error("Database belum disiapkan. Jalankan setupDatabase() terlebih dahulu.");
  return SpreadsheetApp.openById(id);
}
function readDatabase_(){
  const ss=getSpreadsheet_(),out={};
  Object.keys(TABLES).forEach(k=>{
    const d=TABLES[k],sh=ss.getSheetByName(d.sheet);
    if(!sh||sh.getLastRow()<2){out[k]=[];return;}
    const values=sh.getRange(2,1,sh.getLastRow()-1,d.headers.length).getValues();
    out[k]=values.filter(r=>r.some(v=>v!==""&&v!==null)).map(r=>{
      const o={};d.headers.forEach((h,i)=>o[h]=normalizeCell_(r[i]));return o;
    });
  });
  return out;
}
function writeDatabase_(data){
  const ss=getSpreadsheet_();
  Object.keys(TABLES).forEach(k=>{
    const d=TABLES[k];let sh=ss.getSheetByName(d.sheet);
    if(!sh)sh=ss.insertSheet(d.sheet);
    const rows=Array.isArray(data[k])?data[k]:[];
    const values=[d.headers].concat(rows.map(o=>d.headers.map(h=>safeCell_(o&&o[h]))));
    sh.clearContents();
    sh.getRange(1,1,values.length,d.headers.length).setValues(values);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,d.headers.length).setBackground("#285b91").setFontColor("#ffffff").setFontWeight("bold");
  });
}
function safeCell_(v){
  if(v===undefined||v===null)return "";
  if(typeof v==="string"&&/^[=+\\-@]/.test(v))return "'"+v;
  if(typeof v==="number"||typeof v==="boolean")return v;
  return String(v);
}
function normalizeCell_(v){
  if(v instanceof Date)return Utilities.formatDate(v,Session.getScriptTimeZone(),"yyyy-MM-dd");
  return v;
}
function output_(e,payload){
  const cb=e&&e.parameter&&e.parameter.callback;
  if(cb&&/^[A-Za-z_$][0-9A-Za-z_$]{0,100}$/.test(cb)){
    return ContentService.createTextOutput(cb+"("+JSON.stringify(payload)+");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonOutput_(payload);
}
function jsonOutput_(payload){
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
