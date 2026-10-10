(() => {
  'use strict';
  const KEY='back-to-beginning-season1-v1', OLD='https://skykailoon.github.io', NEW='https://mancmy.com';
  const msg=document.querySelector('#message'), button=document.querySelector('#transfer'), retry=document.querySelector('#retry');
  function clean(value) {
    const out={done:{},notes:{}};
    if (!value || typeof value!=='object') return out;
    for(let w=1;w<=12;w++) for(let d=1;d<=7;d++) {
      const k=`${w}-${d}`;
      if(value.done?.[k]===true) out.done[k]=true;
      if(typeof value.notes?.[k]==='string') out.notes[k]=value.notes[k];
    }
    return out;
  }
  function read(){return clean(JSON.parse(localStorage.getItem(KEY)||'{}'));}
  function counts(s){return `${Object.keys(s.done).length} 天已读、${Object.values(s.notes).filter(v=>v.trim()).length} 篇笔记`;}
  if(location.origin===OLD) {
    let target=null, payload=null;
    msg.textContent='请点击下方按钮，在新窗口确认保存。若没有找到旧记录，请换回原来使用的手机和浏览器。';
    button.onclick=()=>{
      try { payload=read(); } catch {msg.textContent='无法读取旧记录，请确认浏览器允许本地储存。';return;}
      target=window.open(NEW+'/transfer.html','mancmy-record-transfer');
      if(!target){msg.textContent='浏览器阻止了新窗口，请允许此网站打开弹出窗口，再试一次。';return;}
      msg.textContent=`已读取 ${counts(payload)}，请到新窗口确认保存。`;
    };
    window.addEventListener('message',e=>{
      if(e.origin!==NEW||e.source!==target||!target||!payload)return;
      if(e.data?.type==='mancmy-transfer-ready')target.postMessage({type:'mancmy-transfer-data',data:payload},NEW);
      if(e.data?.type==='mancmy-transfer-saved')msg.textContent='转移完成！请以后使用 https://mancmy.com。旧网址里的记录仍然保留。';
    });
  } else if(location.origin===NEW) {
    let incoming=null, source=window.opener;
    button.hidden=true;
    const connect=()=>{if(source)source.postMessage({type:'mancmy-transfer-ready'},OLD);};
    retry.hidden=!source; retry.onclick=connect;
    if(!source){
      msg.textContent='请先到旧网址发起转移；使用原来读经的手机和浏览器。';
      const link=document.createElement('a');link.href=OLD+'/clac-reading-2026/season-1/transfer.html';link.textContent='前往旧网址转移记录';msg.append(document.createElement('br'),link);
    } else msg.textContent='正在连接旧网址。若长时间没有回应，请点击重新连接。';
    window.addEventListener('message',e=>{
      if(e.origin!==OLD||e.source!==source||!source||e.data?.type!=='mancmy-transfer-data')return;
      incoming=clean(e.data.data);msg.textContent=`找到 ${counts(incoming)}。点击下方按钮保存到新网址。`;button.textContent='保存到新网址';button.hidden=false;retry.hidden=true;
    });
    button.onclick=()=>{
      if(!incoming)return;
      try {
        const current=read();
        Object.assign(current.done,incoming.done);
        for(const [k,v] of Object.entries(incoming.notes)) {
          if(!v.trim())continue;
          if(!current.notes[k]?.trim())current.notes[k]=v;
          else if(current.notes[k]!==v&&!current.notes[k].endsWith('\n\n【旧网址记录】\n'+v))current.notes[k]+='\n\n【旧网址记录】\n'+v;
        }
        localStorage.setItem(KEY,JSON.stringify(current));
        msg.textContent=`已保存 ${counts(current)}，可返回读经网站查看。`;button.hidden=true;
        source.postMessage({type:'mancmy-transfer-saved'},OLD);incoming=null;
      } catch {msg.textContent='未能保存，旧网址的记录仍然安全。请检查本地储存设置后重试。';}
    };
    connect();
  } else {button.hidden=true;msg.textContent='请从正式读经网址使用记录转移功能。';}
})();