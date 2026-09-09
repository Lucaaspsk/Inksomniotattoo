(() => {
  const SUPABASE_URL = 'https://zoilelcgybqxyfabmsqg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_whBX-zUiCj1U17d1uyaIug_VU2z9CzH';
  const MEDIA_API = `${SUPABASE_URL}/rest/v1/media?select=*&active=eq.true&order=sort_order.asc,created_at.asc`;
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  async function loadMedia() {
    try {
      const res = await fetch(MEDIA_API, { headers, cache: 'no-store' });
      if (!res.ok) return;
      const media = await res.json();
      if (!Array.isArray(media) || !media.length) return;

      const tattoos = media.filter(x => x.category === 'tattoos');
      const piercings = media.filter(x => x.category === 'piercings');
      const merch = media.filter(x => x.category === 'merch');

      if (tattoos.length) renderTattoos(tattoos);
      if (piercings.length) renderPiercings(piercings);
      if (merch.length) renderMerch(merch);
    } catch (err) {
      console.warn('Inksomnio: Supabase no disponible; se mantiene la galería local.', err);
    }
  }

  function renderTattoos(items) {
    const gallery = document.querySelector('#trabajos .gallery');
    if (!gallery) return;
    gallery.innerHTML = items.map(item => `
      <article class="work-card" data-cat="all" tabindex="0">
        <img src="${escapeAttr(item.image_url)}" alt="${escapeAttr(item.title || 'Tatuaje · Inksomnio Tattoo')}" loading="lazy">
        <div class="work-info"><span>Tatuaje</span><strong>${escapeHtml(item.title || 'Trabajo')}</strong></div>
      </article>
    `).join('');
    bindDynamicLightbox(gallery.querySelectorAll('.work-card'));
  }

  function renderPiercings(items) {
    const gallery = document.querySelector('#piercings .piercing-gallery');
    if (!gallery) return;
    gallery.innerHTML = items.map(item => `
      <div class="piercing-card" title="${escapeAttr(item.title || 'Piercing')}" tabindex="0">
        <img src="${escapeAttr(item.image_url)}" alt="${escapeAttr(item.title || 'Piercing · Inksomnio Tattoo')}" loading="lazy">
      </div>
    `).join('');
    gallery.querySelectorAll('.piercing-card').forEach(card => card.addEventListener('click', () => openLightbox(card.querySelector('img').src)));
  }

  function renderMerch(items) {
    const grid = document.querySelector('#tienda .shop-grid');
    if (!grid) return;
    grid.innerHTML = items.map(item => `
      <article class="product-card reveal">
        <div class="product-media shop-image"><img src="${escapeAttr(item.image_url)}" alt="${escapeAttr(item.title || 'Merch Inksomnio Tattoo')}" loading="lazy"></div>
        <div class="product-body">
          <div class="product-kicker">Inksomnio</div>
          <h3>${escapeHtml(item.title || 'Merch oficial')}</h3>
          <p class="product-desc">Diseño oficial de Inksomnio Tattoo.</p>
          <a class="btn buy-btn" href="https://instagram.com/ink_somniotattoo" target="_blank" rel="noopener" data-product="${escapeAttr(item.title || 'Merch')}">Comprar</a>
        </div>
      </article>
    `).join('');
    grid.querySelectorAll('.shop-image').forEach(c => c.addEventListener('click', () => openLightbox(c.querySelector('img').src)));
  }

  function bindDynamicLightbox(cards) {
    cards.forEach(card => {
      card.addEventListener('click', () => openLightbox(card.querySelector('img').src));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(card.querySelector('img').src); });
    });
  }

  function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lbImg');
    if (lb && img) { img.src = src; lb.classList.add('show'); }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function escapeAttr(value) { return escapeHtml(value); }

  window.addEventListener('DOMContentLoaded', loadMedia);
})();
