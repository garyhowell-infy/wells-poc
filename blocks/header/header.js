import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getContentRoot } from '../../scripts/scripts.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/**
 * loads and decorates the header — Wells Fargo three-tier nav:
 *   section 0 → brand/utility bar (logo + utility links + Sign On pill)
 *   section 1 → main navigation sections
 *   section 2 → contextual sub-nav for the active section
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : `${getContentRoot()}/nav`;
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  nav.setAttribute('aria-expanded', 'false');

  const sections = fragment ? [...fragment.querySelectorAll(':scope > div')] : [];
  const [brandSection, mainSection, subSection] = sections;

  // --- Brand / utility bar (section 0) ---
  if (brandSection) {
    const brand = document.createElement('div');
    brand.className = 'nav-brand-bar';

    const logo = brandSection.querySelector('p');
    if (logo) {
      logo.className = 'nav-logo';
      brand.append(logo);
    }

    // Hamburger toggle (mobile only, shown via CSS).
    const hamburger = document.createElement('div');
    hamburger.className = 'nav-hamburger';
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav));
    brand.append(hamburger);

    const utility = brandSection.querySelector('ul');
    if (utility) {
      utility.className = 'nav-utility';
      // Mark the Sign On link (last utility item) as a pill button.
      const items = [...utility.querySelectorAll('li')];
      const signOn = items[items.length - 1];
      if (signOn && /sign on/i.test(signOn.textContent)) {
        signOn.classList.add('nav-utility-cta');
      }
      brand.append(utility);
    }

    nav.append(brand);
  }

  // --- Collapsible wrapper for main + sub nav (mobile drawer) ---
  const menu = document.createElement('div');
  menu.className = 'nav-menu';

  // --- Main navigation (section 1) ---
  if (mainSection) {
    const main = document.createElement('div');
    main.className = 'nav-sections';
    const list = mainSection.querySelector('ul');
    if (list) {
      list.className = 'nav-sections-list';
      // Mark the active top-level section based on the current URL path.
      const here = window.location.pathname;
      list.querySelectorAll('a').forEach((a) => {
        try {
          const linkPath = new URL(a.href, window.location).pathname.replace(/\/$/, '');
          if (linkPath && linkPath !== '' && here.includes(linkPath)) {
            a.closest('li').classList.add('nav-active');
          }
        } catch (e) { /* ignore malformed href */ }
      });
      main.append(list);
    }
    menu.append(main);
  }

  // --- Contextual sub-nav (section 2) ---
  if (subSection) {
    const sub = document.createElement('div');
    sub.className = 'nav-subnav';
    const list = subSection.querySelector('ul');
    if (list) {
      list.className = 'nav-subnav-list';
      sub.append(list);
    }
    menu.append(sub);
  }

  nav.append(menu);

  // Escape closes the mobile drawer.
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav);
    }
  });

  // Reset drawer state when crossing the desktop breakpoint.
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
