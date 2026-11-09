
(function () {
  const C = ["#7b3a2c", "#a8844d", "#5d6247", "#2b2118", "#e4d8bd", "#8a7a5c"];
  const BG = ["#d3c39d", "#c9b78f", "#dccfae"];
  const rnd = (s) => () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) + 1013904223 | 0), ((s ^ (s >>> 13)) >>> 0) / 4294967296);

  function draw(el) {
    const seed = +el.dataset.seed || 1, kind = el.dataset.kind || "paint";
    const [a, b] = (el.dataset.r || "4/5").split("/").map(Number);
    const w = 400, h = Math.round((w * b) / a), r = rnd(seed * 977 + 13);
    let g = `<rect width="${w}" height="${h}" fill="${kind === "gild" ? "#2b2118" : BG[seed % 3]}"/>`;

    if (kind === "tangle") {
      for (let i = 0; i < 9; i++) {
        const p = () => `${r() * w} ${r() * h}`;
        g += `<path d="M${p()}C${p()} ${p()} ${p()}S${p()} ${p()}" fill="none" stroke="${C[i % 4]}" stroke-width="${2 + r() * 6}" stroke-linecap="round" opacity=".85"/>`;
      }
    } else if (kind === "wilt") {
      for (let i = 0; i < 7; i++) {
        const x = 40 + r() * (w - 80), top = h * (.25 + r() * .3), dx = (r() - .5) * 140;
        g += `<path d="M${x} ${h}C${x} ${h * .6} ${x + dx} ${top - 30} ${x + dx} ${top + 40}" fill="none" stroke="${C[2]}" stroke-width="4" stroke-linecap="round"/>`;
        g += `<circle cx="${x + dx}" cy="${top + 60}" r="${18 + r() * 26}" fill="${C[i % 2 ? 0 : 1]}" opacity=".8"/>`;
      }
    } else if (kind === "gild") {
      for (let i = 0; i < 5; i++) {
        const x = r() * w, y = r() * h, s = 40 + r() * 90;
        for (let k = 0; k < 4; k++) g += `<circle cx="${x}" cy="${y}" r="${s - k * 14}" fill="none" stroke="${C[1]}" stroke-width="${1.5 + k}" opacity="${.9 - k * .18}"/>`;
      }
      for (let i = 0; i < 40; i++) g += `<circle cx="${r() * w}" cy="${r() * h}" r="${1 + r() * 3}" fill="#c9a266"/>`;
    } else {
      for (let i = 0; i < 6; i++) {
        const x = r() * w, y = r() * h, s = 40 + r() * 130, t = Math.floor(r() * 2);
        g += t
          ? `<rect x="${x - s / 2}" y="${y - s}" width="${s}" height="${s * 2}" rx="${s / 2}" fill="${C[Math.floor(r() * 6)]}" opacity=".85" transform="rotate(${r() * 90 - 45} ${x} ${y})"/>`
          : `<circle cx="${x}" cy="${y}" r="${s}" fill="${C[Math.floor(r() * 6)]}" opacity=".85"/>`;
      }
    }
    el.outerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${el.dataset.alt || "Artwork placeholder"}">${g}</svg>`;
  }

  document.querySelectorAll(".art").forEach(draw);

  document.querySelectorAll(".portrait-art").forEach((el) => {
    el.outerHTML = `<svg viewBox="0 0 300 380" role="img" aria-label="Portrait of Stephanie Worrell"><rect width="300" height="380" fill="#c9b78f"/><circle cx="150" cy="150" r="118" fill="#a8844d" opacity=".55"/><ellipse cx="150" cy="160" rx="62" ry="82" fill="#e4d8bd"/><path d="M60 380c4-110 50-140 90-140s86 30 90 140Z" fill="#2b2118"/><path d="M86 130c10-70 120-80 130 0-30-34-100-34-130 0Z" fill="#7b3a2c"/><circle cx="126" cy="164" r="4" fill="#2b2118"/><circle cx="174" cy="164" r="4" fill="#2b2118"/><path d="M132 204q18 12 36 0" fill="none" stroke="#7b3a2c" stroke-width="3" stroke-linecap="round"/></svg>`;
  });
})();


(function () {
  const imgs = [...document.querySelectorAll(".series .mat img")];
  if (!imgs.length) return;

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous artwork">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-next" aria-label="Next artwork">&#8250;</button>';
  document.body.appendChild(dlg);

  const big = dlg.querySelector("img");
  const cap = dlg.querySelector("figcaption");
  let current = 0;

  function show(n) {
    current = (n + imgs.length) % imgs.length;
    const src = imgs[current];
    big.src = src.src;
    big.alt = src.alt;
    const fc = src.closest("figure").querySelector("figcaption");
    cap.innerHTML = fc ? fc.innerHTML : src.alt;
  }

  imgs.forEach((im, n) => {
    im.tabIndex = 0;
    im.setAttribute("role", "button");
    im.style.cursor = "zoom-in";
    const open = () => { show(n); dlg.showModal(); };
    im.addEventListener("click", open);
    im.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
  });

  dlg.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (!e.target.closest("img,button,figcaption")) dlg.close(); });
  document.addEventListener("keydown", (e) => {
    if (!dlg.open) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
