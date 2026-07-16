export default function decorate(block) {
  // Extract items from <p> tags inside the first cell (EDS block structure)
  const cell = block.querySelector(':scope > div > div');
  const paragraphs = cell ? [...cell.querySelectorAll('p')] : [];
  const items = paragraphs.length > 0
    ? paragraphs.map((p) => p.textContent.trim()).filter(Boolean)
    : [...block.children].map((row) => row.textContent.trim()).filter(Boolean);
  block.textContent = '';
  block.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // Build individual spans with separator spans, duplicated for seamless loop
  function appendItems(container) {
    items.forEach((item, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'ticker-sep';
        sep.textContent = '·';
        container.append(sep);
      }
      const span = document.createElement('span');
      span.textContent = item;
      container.append(span);
    });
    // Trailing separator for seamless loop
    const sep = document.createElement('span');
    sep.className = 'ticker-sep';
    sep.textContent = '·';
    container.append(sep);
  }

  // Duplicate content for seamless infinite scroll
  appendItems(track);
  appendItems(track);

  block.append(track);
}
