export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    const pic = col.querySelector('picture');
    if (pic) {
      const picWrapper = pic.closest('div');
      if (picWrapper && picWrapper.children.length === 1) {
        picWrapper.classList.add('featured-article-img-col');
      }
    } else {
      const img = col.querySelector(':scope > p > img');
      if (img && col.children.length === 1) {
        col.classList.add('featured-article-img-col');
      } else {
        col.classList.add('featured-article-content');
        // tag pill — first p in content column
        const tag = col.querySelector(':scope > p:first-child');
        if (tag && !tag.querySelector('a, img')) tag.classList.add('tag-pill');
        // em-wrapped tag pills
        col.querySelectorAll('em').forEach((em) => {
          if (!em.querySelector('a') && em.closest('.featured-article')) {
            em.classList.add('tag-pill');
          }
        });
      }
    }
  });
}
