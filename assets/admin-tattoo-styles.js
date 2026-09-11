(() => {
  const KEY = 'inksomnio_custom_tattoo_styles';
  const DEFAULTS = ['general','Realismo','Anime / Color','Fine line','Lettering','Blackwork','Color','Grandes proyectos'];
  const SUPABASE_URL = 'https://zoiielcgybqxyfabmsgq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_whBX-zUiCj1U17d1uyaIug_VU2z9CzH';
  const $ = id => document.getElementById(id);
  const readSaved = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter(Boolean); } catch { return []; } };
  const save = list => localStorage.setItem(KEY, JSON.stringify([...new Set(list)]));
  const esc = s => String(s ?? '').trim();

  function ensureButton() {
    const select = $('style');
    if (!select || $('addStyleBtn')) return;
    const wrap = select.parentElement;
    const btn = document.createElement('button');
    btn.id = 'addStyleBtn';
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = '+ Añadir nuevo estilo';
    btn.style.marginTop = '9px';
    btn.style.width = '100%';
    btn.onclick = () => {
      const name = esc(prompt('Nombre del nuevo estilo de tatuaje:'));
      if (!name) return;
      const existing = [...select.options].map(o => o.value.toLowerCase());
      if (existing.includes(name.toLowerCase())) {
        select.value = [...select.options].find(o => o.value.toLowerCase() === name.toLowerCase()).value;
        return;
      }
      select.add(new Option(name, name));
      select.value = name;
      save([...readSaved(), name]);
    };
    wrap.appendChild(btn);
  }

  async function loadStylesFromMedia() {
    const select = $('style');
    if (!select || !window.supabase?.createClient) return;
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data } = await client.from('media').select('style').eq('category', 'tattoos');
    const names = [...DEFAULTS, ...readSaved(), ...(data || []).map(x => x.style).filter(Boolean)];
    const current = select.value;
    const seen = new Set([...select.options].map(o => o.value.toLowerCase()));
    names.forEach(name => {
      name = esc(name);
      if (!name || seen.has(name.toLowerCase())) return;
      select.add(new Option(name, name));
      seen.add(name.toLowerCase());
    });
    if (current) select.value = current;
  }

  function start() {
    ensureButton();
    loadStylesFromMedia();
    const observer = new MutationObserver(ensureButton);
    const style = $('style');
    if (style?.parentElement) observer.observe(style.parentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
