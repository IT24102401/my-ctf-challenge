/* Shared recon search widget. Any page that includes this script and has
   #q / #go / #results elements gets a working search box, wired to the
   same closed corpus. Navigation is same-tab (no target attribute). */

const AVALON_INDEX = [
  {
    keywords: ["vale_e77"],
    title: "Credential dump — fragment #0417",
    url: "leak.html",
    snippet: "Cached mirror of a leaked credential dump. One row matches this alias, with a partially redacted contact field.",
    domain: "dump.paste-mirror.example"
  },
  {
    keywords: ["elias vale"],
    title: "Old forum thread — \"anyone know an Elias Vale?\"",
    url: "#",
    snippet: "General discussion thread from an unrelated forum. No connection found to the alias vale_e77.",
    domain: "forums.example",
    dead: true
  },
  {
    keywords: ["e.sveyne_arch", "sveyne_arch", "e sveyne arch"],
    title: "Cached member profile — e.sveyne_arch",
    url: "profile.html",
    snippet: "Archived forum profile, last active 2021. Signature line references a current handle.",
    domain: "forums.oldnet.example",
    restricted: true
  },
  {
    keywords: ["sveyne"],
    title: "Surname index — Sveyne",
    url: "#",
    snippet: "Regional surname index. Too broad on its own to narrow down a specific person.",
    domain: "genealogy.example",
    dead: true
  },
  {
    keywords: ["elian.sveyne", "elian sveyne"],
    title: "Cached link page — elian.sveyne",
    url: "final.html",
    snippet: "Archived snapshot of a link-in-bio style page. One of its links still resolves.",
    domain: "links.mirror.example",
    restricted: true
  }
];

const AVALON_NO_RESULTS_FLAVOR = [
  "No matching rows in this index. Not every handle leaves a paper trail.",
  "Nothing cached under that. It may never have been indexed, or it was and someone made sure it wouldn't be found.",
  "No hits. The terminal only surfaces what search engines happened to cache — not everything gets cached.",
  "No matching entries. Try the exact alias, not a guess at the name behind it."
];

(function(){
  const qEl = document.getElementById('q');
  const goEl = document.getElementById('go');
  const resultsEl = document.getElementById('results');
  if(!qEl || !goEl || !resultsEl) return;

  function norm(s){ return s.toLowerCase().trim().replace(/\s+/g, ' '); }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[c]));
  }

  function escapeRegex(s){
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function noResultsMessage(query){
    const flavor = AVALON_NO_RESULTS_FLAVOR[Math.floor(Math.random() * AVALON_NO_RESULTS_FLAVOR.length)];
    return `<div class="result-count">No records found for &ldquo;${escapeHtml(query)}&rdquo;.</div>
            <div class="result-count" style="font-style:italic; border-top:none; margin-top:2px; padding-top:0;">${flavor}</div>`;
  }

  function matches(entry, query){
    const q = query.trim();
    if(q.length < 3) return false;
    return entry.keywords.some(k => {
      if(q.includes(k)) return true;
      const re = new RegExp('(^|[^a-z0-9])' + escapeRegex(q) + '($|[^a-z0-9])', 'i');
      return re.test(k);
    });
  }

  function search(){
    const raw = norm(qEl.value);
    resultsEl.innerHTML = "";

    if(!raw){
      resultsEl.innerHTML = '<div class="result-count">Enter a handle or alias above.</div>';
      return;
    }

    const hits = AVALON_INDEX.filter(entry => matches(entry, raw));

    if(hits.length === 0){
      resultsEl.innerHTML = noResultsMessage(qEl.value);
      return;
    }

    hits.forEach(hit => {
      const div = document.createElement('div');
      div.className = 'result' + (hit.restricted ? ' restricted' : '');
      const link = hit.dead ? '#' : hit.url;
      div.innerHTML = `
        <div class="result-url">${hit.domain}</div>
        <div class="result-title"><a href="${link}" ${hit.dead ? 'data-dead="1"' : ''}>${hit.title}</a></div>
        <div class="result-snip">${hit.snippet}</div>
        ${hit.dead ? '<div class="dead-note">This record could not be retrieved.</div>' : ''}
      `;
      resultsEl.appendChild(div);
    });

    resultsEl.innerHTML += `<div class="result-count">${hits.length} record${hits.length===1?'':'s'} found.</div>`;

    resultsEl.querySelectorAll('a[data-dead]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        alert("This record could not be retrieved. It may have been removed, misfiled, or never existed under this name.");
      });
    });
  }

  goEl.addEventListener('click', search);
  qEl.addEventListener('keydown', e => { if(e.key === 'Enter') search(); });
})();
