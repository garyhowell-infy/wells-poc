export default function decorate(block) {
  // Each row is a profile: avatar image | name + role + bio
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const avatarCol = cols[0];
    const textCol = cols[1];

    // Detect avatar image column
    const img = avatarCol.querySelector('picture') || avatarCol.querySelector(':scope > p > img');
    if (img) {
      avatarCol.classList.add('team-profile-avatar');
    }

    textCol.classList.add('team-profile-text');
  });
}
