const pages = [...document.querySelectorAll('.page')];
const navButtons = [...document.querySelectorAll('[data-nav]')];
const toolInfo = {
  secrets: {title:'Secret Tools', description:'إدارة المفاتيح والبيانات السرية.', body:'<h3>المفاتيح السرية</h3><p>ستظهر هنا المتغيرات السرية بعد ربط الخادم. لا تضعي مفاتيح حقيقية في هذه النسخة التجريبية أو في ملفات الواجهة العامة.</p><label class="field"><span>اسم المتغير</span><input placeholder="مثال: SERVICE_ROLE_KEY" disabled></label><label class="field"><span>القيمة</span><input placeholder="ستتوفر عند تنفيذ الربط الآمن" disabled></label><button class="primary-btn" disabled>إضافة مفتاح · قريباً</button>'},
  general: {title:'General Tools', description:'المفاتيح العامة وإعدادات الاتصال.', body:'<h3>إعدادات الربط العامة</h3><p>هذه مساحة إعداد عنوان الخدمة والمفتاح العام وخيارات الاتصال.</p><label class="field"><span>Project URL</span><input placeholder="https://your-project.example" disabled></label><label class="field"><span>Public / Anon Key</span><input placeholder="المفتاح العام" disabled></label><button class="primary-btn" disabled>حفظ الإعدادات · قريباً</button>'},
  sql: {title:'SQL Table', description:'إدارة جداول تجريبية محلياً، إلى حين ربط قاعدة البيانات.', body:'<div class="sql-notice"><b>وضع محلي تجريبي</b><span>التغييرات تُحفظ في هذا المتصفح فقط، ولا تُرسل إلى Supabase أو أي خادم.</span></div><div class="sql-layout"><aside class="sql-sidebar"><div class="sql-section-head"><b>الجداول</b><button class="mini-btn" id="newTableToggle">+ جدول</button></div><div id="sqlTableList" class="sql-table-list"></div><form id="newTableForm" class="sql-create-form" hidden><label class="field"><span>اسم الجدول</span><input id="newTableName" required pattern="[A-Za-z_][A-Za-z0-9_]*" placeholder="مثال: products"></label><label class="field"><span>الأعمدة (افصلي بينها بفواصل)</span><input id="newTableColumns" required placeholder="name, price, category"></label><button class="primary-btn" type="submit">إنشاء الجدول</button></form></aside><section class="sql-main"><div class="sql-section-head"><div><b id="sqlActiveName">اختاري جدولاً</b><small id="sqlRowCount" class="muted"></small></div><button class="mini-btn" id="exportCsv">تصدير CSV</button></div><div class="sql-search-row"><input id="sqlSearch" type="search" placeholder="بحث في السجلات..." aria-label="بحث في السجلات"><button class="primary-btn" id="addRowToggle">+ سجل</button></div><form id="newRowForm" class="sql-create-form" hidden><div id="newRowFields" class="sql-form-grid"></div><button class="primary-btn" type="submit">إضافة السجل</button><button class="mini-btn" type="button" id="cancelNewRow">إلغاء</button></form><div class="sql-table-wrap"><table class="data-table"><thead id="sqlHead"></thead><tbody id="sqlBody"></tbody></table></div><p id="sqlEmpty" class="muted sql-empty" hidden>لا توجد سجلات مطابقة.</p><details class="sql-console"><summary>استعلام SQL تجريبي</summary><p class="muted">يدعم هذا المختبر SELECT * FROM table وشرط WHERE بسيطاً للمساواة. لا ينفّذ SQL حقيقياً.</p><textarea id="sqlQuery" rows="3" dir="ltr" placeholder="SELECT * FROM profiles"></textarea><div class="sql-console-actions"><button class="primary-btn" id="runSql" type="button">تشغيل الاستعلام</button><span id="sqlQueryStatus" class="muted"></span></div><pre id="sqlQueryResult" class="sql-query-result" hidden></pre></details></section></div>'},
  editor: {title:'Code Editor', description:'محرر ملفات HTML وCSS وJavaScript.', body:'<h3>محرر الأكواد</h3><div class="field"><span>اسم الملف</span><input id="fileName" value="index.html" /></div><div class="editor-toolbar"><button data-edit="select">تحديد الكل</button><button data-edit="copy">نسخ</button><button data-edit="cut">قص</button><button data-edit="paste">لصق</button><button data-edit="undo">تراجع</button><button data-edit="redo">إعادة</button><button data-edit="clear">مسح الكل</button></div><textarea class="editor-area" id="codeArea" spellcheck="false" aria-label="محرر الأكواد"><!doctype html>\n<html lang="ar">\n  <head>\n    <meta charset="utf-8">\n    <title>My Project</title>\n  </head>\n  <body>\n    <h1>Hello Potato!</h1>\n  </body>\n</html></textarea><div class="workspace-footer"><span class="muted" id="editorStatus">جاهز للتحرير</span><button class="primary-btn" id="saveCode">حفظ الملف</button></div>'}
};
let currentPage = 'data';
function showPage(name){currentPage=name;pages.forEach(p=>p.classList.toggle('active',p.dataset.page===name));navButtons.forEach(b=>b.classList.toggle('active',b.dataset.nav===name));}
navButtons.forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.nav)));
document.querySelectorAll('.schema-node').forEach(node=>node.addEventListener('click',()=>{document.getElementById('detailTitle').textContent=node.querySelector('b').textContent;document.getElementById('detailText').textContent=node.dataset.detail;openModal('detailModal')}));
document.querySelectorAll('.tool-card').forEach(card=>card.addEventListener('click',()=>openTool(card.dataset.tool)));
function openTool(key){const info=toolInfo[key];if(!info)return;document.getElementById('toolTitle').textContent=info.title;document.getElementById('toolEyebrow').textContent='أدوات العمل';document.getElementById('toolDescription').textContent=info.description;document.getElementById('toolWorkspace').innerHTML=info.body;showPage('tool-detail');if(key==='editor')wireEditor();if(key==='sql')wireSqlTool();}
document.getElementById('backTools').addEventListener('click',()=>showPage('tools'));
function openModal(id){document.getElementById(id).hidden=false}
function closeModal(id){document.getElementById(id).hidden=true}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
document.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>setTheme(btn.dataset.theme)));
function setTheme(theme){let resolved=theme;if(theme==='system')resolved=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=resolved;document.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('selected',b.dataset.theme===theme));localStorage.setItem('potato-theme',theme)}
const savedTheme=localStorage.getItem('potato-theme')||'dark';setTheme(savedTheme);
document.getElementById('refreshBtn').addEventListener('click',e=>{e.currentTarget.textContent='✓ تم تحديث العرض';setTimeout(()=>e.currentTarget.textContent='↻ تحديث العرض',1200)});
document.getElementById('searchOpen').addEventListener('click',()=>{openModal('searchModal');document.getElementById('globalSearch').focus()});
const searchable=[{name:'البيانات',desc:'مخطط المشروع والجداول',page:'data'},{name:'Secret Tools',desc:'المفاتيح السرية',tool:'secrets'},{name:'General Tools',desc:'إعدادات الربط والمفاتيح العامة',tool:'general'},{name:'SQL Table',desc:'الجداول والاستعلامات',tool:'sql'},{name:'Code Editor',desc:'محرر الأكواد',tool:'editor'},{name:'الإعدادات',desc:'المظهر والثيم',page:'settings'}];
document.getElementById('globalSearch').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const box=document.getElementById('searchResults');if(!q){box.innerHTML='<p class="muted">ابدئي بكتابة اسم الأداة أو القسم.</p>';return}const results=searchable.filter(x=>(x.name+' '+x.desc).toLowerCase().includes(q));box.innerHTML=results.length?results.map((x,i)=>'<button class="search-result" data-result="'+i+'"><b>'+x.name+'</b><small>'+x.desc+'</small></button>').join(''):'<p class="muted">لا توجد نتائج مطابقة.</p>';box.querySelectorAll('[data-result]').forEach(b=>b.addEventListener('click',()=>{const item=results[Number(b.dataset.result)];closeModal('searchModal');if(item.tool)openTool(item.tool);else showPage(item.page)}))});
let undoStack=[],redoStack=[];
function wireEditor(){const area=document.getElementById('codeArea');const status=document.getElementById('editorStatus');if(!area)return;undoStack=[area.value];redoStack=[];area.addEventListener('input',()=>{if(undoStack[undoStack.length-1]!==area.value){undoStack.push(area.value);redoStack=[]}status.textContent='تم تعديل الملف'});document.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',async()=>{const action=btn.dataset.edit;area.focus();try{if(action==='select')area.select();if(action==='copy'){await navigator.clipboard.writeText(area.value);status.textContent='تم النسخ'}if(action==='cut'){await navigator.clipboard.writeText(area.value);area.value='';area.dispatchEvent(new Event('input'));status.textContent='تم القص'}if(action==='paste'){area.setRangeText(await navigator.clipboard.readText(),area.selectionStart,area.selectionEnd,'end');area.dispatchEvent(new Event('input'));status.textContent='تم اللصق'}if(action==='clear'){area.value='';area.dispatchEvent(new Event('input'));status.textContent='تم مسح المحتوى'}if(action==='undo'&&undoStack.length>1){redoStack.push(undoStack.pop());area.value=undoStack[undoStack.length-1];status.textContent='تم التراجع'}if(action==='redo'&&redoStack.length){const value=redoStack.pop();undoStack.push(value);area.value=value;status.textContent='تمت الإعادة'}}catch(err){status.textContent='تعذر الوصول للحافظة، استخدمي أدوات لوحة المفاتيح'}}));document.getElementById('saveCode').addEventListener('click',()=>{const name=document.getElementById('fileName').value.trim()||'code.txt';const blob=new Blob([area.value],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);status.textContent='تم تنزيل الملف على الجهاز'});}
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openModal('searchModal');document.getElementById('globalSearch').focus()}if(e.key==='Escape')document.querySelectorAll('.modal-backdrop').forEach(m=>closeModal(m.id))});

const SQL_STORAGE_KEY='potato-sql-playground-v1';
const defaultSqlData={
  profiles:{columns:['id','name','email','status'],rows:[
    {id:1,name:'هناء',email:'hana@example.test',status:'active'},
    {id:2,name:'سارة',email:'sara@example.test',status:'active'},
    {id:3,name:'ليان',email:'layan@example.test',status:'pending'}
  ]},
  tasks:{columns:['id','title','priority','done'],rows:[
    {id:1,title:'إعداد الواجهة',priority:'high',done:'yes'},
    {id:2,title:'اختبار الجداول',priority:'medium',done:'no'}
  ]}
};
let sqlData;
function loadSqlData(){
  try{const saved=JSON.parse(localStorage.getItem(SQL_STORAGE_KEY));sqlData=saved&&typeof saved==='object'?saved:structuredClone(defaultSqlData);}
  catch(error){sqlData=structuredClone(defaultSqlData);}
  if(!sqlData||!Object.keys(sqlData).length)sqlData=structuredClone(defaultSqlData);
}
function saveSqlData(){localStorage.setItem(SQL_STORAGE_KEY,JSON.stringify(sqlData));}
function safeText(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
let activeSqlTable='';
function wireSqlTool(){
  loadSqlData();
  const list=document.getElementById('sqlTableList');
  const head=document.getElementById('sqlHead');
  const body=document.getElementById('sqlBody');
  const search=document.getElementById('sqlSearch');
  const addForm=document.getElementById('newRowForm');
  const tableForm=document.getElementById('newTableForm');
  if(!list)return;
  if(!activeSqlTable||!sqlData[activeSqlTable])activeSqlTable=Object.keys(sqlData)[0]||'';
  function renderList(){
    list.innerHTML=Object.keys(sqlData).map(name=>'<button type="button" class="sql-table-choice '+(name===activeSqlTable?'selected':'')+'" data-sql-table="'+safeText(name)+'"><span>▤</span>'+safeText(name)+'<small>'+sqlData[name].rows.length+'</small></button>').join('');
    list.querySelectorAll('[data-sql-table]').forEach(button=>button.addEventListener('click',()=>{activeSqlTable=button.dataset.sqlTable;search.value='';renderAll();}));
  }
  function renderRows(){
    const table=sqlData[activeSqlTable];
    if(!table){head.innerHTML='';body.innerHTML='';return;}
    const query=search.value.trim().toLowerCase();
    const rows=table.rows.map((row,index)=>({row,index})).filter(item=>!query||table.columns.some(col=>String(item.row[col]??'').toLowerCase().includes(query)));
    head.innerHTML='<tr>'+table.columns.map(col=>'<th>'+safeText(col)+'</th>').join('')+'<th>إجراء</th></tr>';
    body.innerHTML=rows.map(({row,index})=>'<tr>'+table.columns.map(col=>'<td>'+safeText(row[col])+'</td>').join('')+'<td><button type="button" class="row-delete" data-delete-row="'+index+'" aria-label="حذف السجل">حذف</button></td></tr>').join('');
    body.querySelectorAll('[data-delete-row]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.deleteRow);if(!Number.isInteger(index)||!confirm('حذف هذا السجل؟'))return;table.rows.splice(index,1);saveSqlData();renderAll();}));
    document.getElementById('sqlActiveName').textContent=activeSqlTable||'لا توجد جداول';
    document.getElementById('sqlRowCount').textContent=table.rows.length+' سجل';
    document.getElementById('sqlEmpty').hidden=rows.length>0;
  }
  function renderAll(){renderList();renderRows();}
  document.getElementById('newTableToggle').onclick=()=>{tableForm.hidden=!tableForm.hidden;};
  tableForm.onsubmit=event=>{
    event.preventDefault();
    const name=document.getElementById('newTableName').value.trim();
    const columns=[...new Set(document.getElementById('newTableColumns').value.split(',').map(x=>x.trim()).filter(Boolean))];
    if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)){alert('اسم الجدول يجب أن يبدأ بحرف أو _ ويحتوي على أحرف وأرقام و _ فقط.');return;}
    if(sqlData[name]){alert('هذا الجدول موجود بالفعل.');return;}
    if(!columns.length||columns.some(col=>! /^[A-Za-z_][A-Za-z0-9_]*$/.test(col))){alert('أدخلي أسماء أعمدة صحيحة مفصولة بفواصل.');return;}
    sqlData[name]={columns,rows:[]};activeSqlTable=name;saveSqlData();tableForm.reset();tableForm.hidden=true;renderAll();
  };
  document.getElementById('addRowToggle').onclick=()=>{
    const table=sqlData[activeSqlTable];if(!table)return;
    document.getElementById('newRowFields').innerHTML=table.columns.filter(c=>c!=='id').map(col=>'<label class="field"><span>'+safeText(col)+'</span><input name="'+safeText(col)+'" placeholder="'+safeText(col)+'"></label>').join('');
    addForm.hidden=!addForm.hidden;
  };
  document.getElementById('cancelNewRow').onclick=()=>{addForm.hidden=true;};
  addForm.onsubmit=event=>{
    event.preventDefault();const table=sqlData[activeSqlTable];if(!table)return;
    const row={};const idCol=table.columns.includes('id');
    if(idCol)row.id=table.rows.reduce((max,item)=>Math.max(max,Number(item.id)||0),0)+1;
    table.columns.forEach(col=>{if(col!=='id')row[col]=addForm.elements.namedItem(col)?.value.trim()||'';});
    table.rows.push(row);saveSqlData();addForm.reset();addForm.hidden=true;renderAll();
  };
  search.oninput=renderRows;
  document.getElementById('exportCsv').onclick=()=>{
    const table=sqlData[activeSqlTable];if(!table)return;
    const quote=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
    const csv=[table.columns.map(quote).join(','),...table.rows.map(row=>table.columns.map(col=>quote(row[col])).join(','))].join('\r\n');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=activeSqlTable+'.csv';a.click();URL.revokeObjectURL(url);
  };
  document.getElementById('runSql').onclick=()=>{
    const query=document.getElementById('sqlQuery').value.trim();
    const status=document.getElementById('sqlQueryStatus');const result=document.getElementById('sqlQueryResult');
    const match=query.match(/^SELECT\s+\\*\s+FROM\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+WHERE\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*'([^']*)')?\s*;?$/i);
    if(!match){status.textContent='صيغة غير مدعومة في المختبر.';result.hidden=true;return;}
    const table=sqlData[match[1]];if(!table){status.textContent='الجدول غير موجود.';result.hidden=true;return;}
    if(match[2]&&!table.columns.includes(match[2])){status.textContent='العمود غير موجود.';result.hidden=true;return;}
    const rows=match[2]?table.rows.filter(row=>String(row[match[2]])===match[3]):table.rows;
    status.textContent=rows.length+' نتيجة';result.textContent=JSON.stringify(rows,null,2);result.hidden=false;
  };
  renderAll();
}
