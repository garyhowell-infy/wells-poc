/*
 * Builds a visual Sign On card for the marquee hero (matches wellsfargo.com).
 * The inputs are display-only (readonly, autocomplete off, no name, no form
 * submission) — this is a POC visual replica and does NOT capture or transmit
 * credentials. The Sign On / Enroll actions link to the real Wells Fargo URLs.
 */
function buildSignOnCard() {
  const signOnUrl = 'https://connect.secure.wellsfargo.com/auth/login/present?origin=biz&LOB=BIZ';
  const enrollUrl = 'https://oam.wellsfargo.com/oamo/identity/authentication?execution=e1s1/';
  const card = document.createElement('div');
  card.className = 'hero-signon';
  const field = (label, type) => `
    <label class="hero-signon-field">
      <input type="${type}" placeholder="${label}" readonly aria-label="${label}" autocomplete="off">
      <span>${label}</span>
    </label>`;
  card.innerHTML = `
    <div class="hero-signon-card">
      <h2>Good evening</h2>
      <p class="hero-signon-sub">Sign on to manage your accounts.</p>
      ${field('Username', 'text')}
      ${field('Password', 'password')}
      <label class="hero-signon-save"><input type="checkbox" disabled> Save username</label>
      <div class="hero-signon-actions">
        <a class="button primary" href="${signOnUrl}">Sign On</a>
        <a class="hero-signon-enroll" href="${enrollUrl}">Enroll</a>
      </div>
    </div>
    <div class="hero-signon-links">
      <a href="https://connect.secure.wellsfargo.com/auth/login/present?passkey=Y">Sign on with a passkey</a>
      <a href="https://oam.wellsfargo.com/oamo/identity/help/passwordhelp/">Forgot username or password?</a>
      <a href="/privacy-security/?linkLoc=signon">Privacy, Cookies, and Legal</a>
    </div>`;
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length >= 2) {
    const imageRow = rows[0];
    const contentRow = rows[1];
    const contentCell = contentRow.querySelector(':scope > div') || contentRow;

    // Preserve existing <picture> with its <source> elements; fall back to wrapping bare <img>
    const picture = imageRow.querySelector('picture');
    if (picture) {
      block.replaceChildren(picture, contentCell);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const pic = document.createElement('picture');
        pic.append(img);
        block.replaceChildren(pic, contentCell);
      } else {
        block.replaceChildren(contentCell);
      }
    }
  }

  // Tag pills: eyebrow p and em-wrapped tags
  const contentDiv = block.querySelector(':scope > div');
  if (contentDiv) {
    const firstP = contentDiv.querySelector(':scope > p:first-child');
    if (firstP && !firstP.querySelector('a, img')) firstP.classList.add('tag-pill');
    contentDiv.querySelectorAll('em').forEach((em) => {
      if (!em.querySelector('a')) em.classList.add('tag-pill');
    });
  }

  // Marquee hero: the WF homepage/biz banner is a two-column overlay (Sign On
  // card + promo CTA). A marquee without a CTA link (e.g. the About page) is a
  // simple image banner with a centered heading — no Sign On card, no overlay.
  if (block.classList.contains('hero-marquee')) {
    const hasCta = !!block.querySelector(':scope > div a');
    if (hasCta) {
      block.prepend(buildSignOnCard());
    } else {
      block.classList.add('hero-marquee-simple');
    }
  }
}
