import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getContentRoot } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer — Wells Fargo legal footer:
 *   section 0 → row of legal/nav links
 *   section 1 → copyright line
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : `${getContentRoot()}/footer`;
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll(':scope > .section');
  if (sections.length >= 2) {
    sections[0].classList.add('footer-links');
    sections[sections.length - 1].classList.add('footer-copyright');
  } else if (sections.length === 1) {
    sections[0].classList.add('footer-links');
  }

  block.append(footer);
}
