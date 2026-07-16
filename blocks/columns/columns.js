export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const img = col.querySelector(':scope > p > img');
      if ((pic && col.children.length === 1) || (img && col.children.length === 1)) {
        col.classList.add('columns-img-col');
      } else {
        col.classList.add('columns-text-col');
      }
    });
  });
}
