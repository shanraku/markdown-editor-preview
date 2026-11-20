"use strict";
(() => {
  const editor = document.getElementById("markdownInput");
  const preview = document.getElementById("preview");
  const wordCount = document.getElementById("wordCount");
  const toast = document.getElementById("toast");
  const escapeHtml = (value) => value.replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl = (raw) => {
    try { const url = new URL(raw); return ["https:","http:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  function inline(text) {
    let out = escapeHtml(text);
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      const safe = safeUrl(url);
      return safe ? '<a href="' + escapeHtml(safe) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>' : label;
    });
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/__(.+?)__/g, "<strong>$1</strong>");
    out = out.replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/_(.+?)_/g, "<em>$1</em>");
    return out;
  }
  function renderMarkdown(source) {
    const lines = source.replace(/\r\n?/g,"\n").split("\n");
    const html = []; let inCode = false, code = [], list = "";
    const closeList = () => { if (list) { html.push("</" + list + ">"); list = ""; } };
    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        closeList();
        if (inCode) { html.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>"); code=[]; inCode=false; }
        else inCode=true;
        continue;
      }
      if (inCode) { code.push(line); continue; }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (heading) { closeList(); const n=heading[1].length; html.push("<h"+n+">"+inline(heading[2])+"</h"+n+">"); }
      else if (bullet || ordered) {
        const type = bullet ? "ul" : "ol"; if (list !== type) { closeList(); list=type; html.push("<"+list+">"); }
        html.push("<li>"+inline((bullet||ordered)[1])+"</li>");
      } else if (/^\s*>/.test(line)) { closeList(); html.push("<blockquote>"+inline(line.replace(/^\s*>\s?/,""))+"</blockquote>"); }
      else if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(line)) { closeList(); html.push("<hr>"); }
      else if (line.trim()) { closeList(); html.push("<p>"+inline(line)+"</p>"); }
      else closeList();
    }
    if (inCode) html.push("<pre><code>"+escapeHtml(code.join("\n"))+"</code></pre>");
    closeList();
    return html.join("\n") || '<p class="empty-preview">Your preview will appear here…</p>';
  }
  function update() {
    preview.innerHTML = renderMarkdown(editor.value);
    const words = editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0;
    wordCount.textContent = words + (words === 1 ? " word" : " words");
  }
  let toastTimer;
  function notify(message) { toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),1800); }
  editor.addEventListener("input", update);
  document.getElementById("copyButton").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(editor.value); notify("Markdown copied"); }
    catch { editor.select(); notify("Select and copy your Markdown"); }
  });
  document.getElementById("downloadButton").addEventListener("click", () => {
    const blob=new Blob([editor.value],{type:"text/markdown;charset=utf-8"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="document.md"; a.click(); URL.revokeObjectURL(url); notify("Markdown download started");
  });
  document.getElementById("themeToggle").addEventListener("click", (event) => {
    const light=document.body.classList.toggle("light");
    event.currentTarget.setAttribute("aria-pressed",String(light));
    event.currentTarget.querySelector("span").textContent=light?"Dark mode":"Light mode";
  });
  update();
})();