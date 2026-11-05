/* ==================================================================
   Bhawani – site script
   Includes · Header & mobile menu · Search · Cart drawer · Wishlist
   Shop filters · FAQ · Legal TOC · Product detail · Forms · Reveal
   ================================================================== */
(() => {
  "use strict";

  /* ---------- Config ---------- */
  const CONFIG = {
    whatsapp: "917073737402", // order number used by "Checkout on WhatsApp"
    freeShippingFrom: 199,
    shippingFee: 49,
    maxQty: 10,
    cartKey: "bhawani_cart_v1",
    wishKey: "bhawani_wishlist_v1",
  };

  // Offer tiers shown on the home page strip and in the cart progress bar
  const REWARDS = [
    { at: 199, label: "Free shipping", icon: "bi-truck" },
    { at: 399, label: "a free gift", icon: "bi-gift" },
    { at: 499, label: "10% off", icon: "bi-percent" },
    { at: 699, label: "15% off", icon: "bi-stars" },
  ];

  // Used by search and as a fallback for cart thumbnails
  const CATALOG = [
    {
      name: "Washing Machine Descaler 3pc",
      title: "Washing Machine Descaler Pouches, 3pc",
      price: 199,
      mrp: 360,
      image: "images/product-washing-machine.jpg",
    },
    {
      name: "Floor Cleaner 850ml",
      title: "Professional Tile & Floor Cleaner, 850ml",
      price: 269,
      mrp: 0,
      image: "images/product-floor-cleaner.jpg",
    },
    {
      name: "Toilet Bathroom Combo",
      title: "Toilet + Bathroom Cleaner Combo, 1L + 1L",
      price: 299,
      mrp: 599,
      image: "images/product-toilet-bathroom.jpg",
    },
    {
      name: "Dishwash Liquid 1L",
      title: "Natural Dishwash Liquid – Plant-Based, 1L",
      price: 299,
      mrp: 0,
      image: "images/product-dishwash.jpg",
    },
    {
      name: "Adeha Room Spray B2G1",
      title: "Adeha Room Spray – Buy 2 Get 1 Free, 218ml x3",
      price: 398,
      mrp: 597,
      image: "images/combo-room-spray.jpg",
    },
    {
      name: "Adeha Rose Mist 218ml",
      title: "Adeha Rose Mist Room Freshener, 218ml",
      price: 199,
      mrp: 0,
      image: "images/combo-room-spray.jpg",
    },
    {
      name: "Adeha Lavender Dream 218ml",
      title: "Adeha Lavender Dream Room Freshener, 218ml",
      price: 199,
      mrp: 0,
      image: "images/combo-room-spray.jpg",
    },
    {
      name: "Kitchen Degreaser 450ml",
      title: "Kitchen Cleaner & Degreaser Spray – 450ml",
      price: 250,
      mrp: 0,
      image: "images/product-kitchen-spray.jpg",
    },
    {
      name: "Klenzmo Dishwash Gel 1L",
      title: "Klenzmo Dishwash Concentrate Gel, 1L",
      price: 279,
      mrp: 0,
      image: "images/product-dishwash.jpg",
    },
    {
      name: "Magic Eraser Sponge 4pc",
      title: "Magic Eraser Multi-Purpose Cleaning Sponge, 4pc",
      price: 299,
      mrp: 329,
      image: "images/product-magic-eraser.jpg",
    },
    {
      name: "Toilet Cleaner Rose 1L",
      title: "Toilet Cleaner Liquid – Rose Fragrance, 1L",
      price: 275,
      mrp: 0,
      image: "images/product-toilet-cleaner.jpg",
    },
    {
      name: "WM Cleaner Tablets 6pc",
      title: "Washing Machine Cleaner Tablets, Pack of 6",
      price: 179,
      mrp: 360,
      image: "images/product-wm-tablets.jpg",
    },
    {
      name: "Bathroom Combo",
      title: "Bathroom Combo – Tap, Shower & Tile Cleaner",
      price: 649,
      mrp: 898,
      image: "images/combo-bathroom.jpg",
    },
    {
      name: "Toilet Tile Combo",
      title: "Toilet + Tile & Bathroom Cleaner Combo (1L + 850ml)",
      price: 599,
      mrp: 874,
      image: "images/combo-toilet-tile.jpg",
    },
    {
      name: "Home Care Trial Kit",
      title: "Home Care Trial Kit – Plant-Based Essentials",
      price: 499,
      mrp: 799,
      image: "images/combo-trial-kit.jpg",
    },
    {
      name: "Toilet Cleaner 5L",
      title: "Toilet Cleaner Liquid – Rose Fragrance, Bulk 5L",
      price: 799,
      mrp: 0,
      image: "images/mega-toilet-5l.jpg",
    },
    {
      name: "Floor Cleaner Floral 5L",
      title: "Floor Cleaner Concentrate – Floral Wave, 5L",
      price: 799,
      mrp: 1599,
      image: "images/mega-floor-floral-5l.jpg",
    },
    {
      name: "Floor Cleaner Tropical 5L",
      title: "Floor Cleaner Concentrate – Tropical Breeze, 5L",
      price: 799,
      mrp: 1599,
      image: "images/mega-floor-tropical-5l.jpg",
    },
    {
      name: "Magic Eraser Sponge 2pc",
      title: "Magic Eraser Sponge 2pc",
      price: 179,
      mrp: 0,
      image: "images/product-magic-eraser.jpg",
    },
    {
      name: "Magic Eraser Sponge 8pc",
      title: "Magic Eraser Sponge 8pc",
      price: 499,
      mrp: 0,
      image: "images/product-magic-eraser.jpg",
    },
  ];

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => "\u20B9" + Math.round(n).toLocaleString("en-IN");
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const slug = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const findProduct = (name) => CATALOG.find((p) => p.name === name);
  const read = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* storage blocked */
    }
  };

  const syncScrollLock = () => {
    const b = document.body.classList;
    b.toggle("no-scroll", b.contains("nav-open") || b.contains("cart-open"));
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(message, icon = "bi-check-circle-fill") {
    const el = $("#toast");
    if (!el) return;
    el.innerHTML = `<i class="bi ${icon}"></i><span>${esc(message)}</span>`;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Include header + footer ---------- */
  function include(url, target) {
    if (!target) return Promise.resolve();
    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then((html) => {
        target.innerHTML = html;
      })
      .catch((err) =>
        console.error(
          `Could not load ${url}. Open the site through a web server (not file://).`,
          err,
        ),
      );
  }

  /* ==================================================================
     HEADER + MOBILE MENU
     ================================================================== */
  function initHeader() {
    const header = $("#site-header");
    const nav = $("#main-nav");
    const toggle = $("#nav-toggle");
    if (!header || !nav || !toggle) return;

    const icon = $("i", toggle);
    const mobile = window.matchMedia("(max-width: 900px)");

    const setNav = (open) => {
      if (open)
        document.documentElement.style.setProperty(
          "--nav-top",
          Math.max(0, header.getBoundingClientRect().bottom) + "px",
        );
      nav.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      icon.className = open ? "bi bi-x-lg" : "bi bi-list";
      if (!open)
        $$(".nav-item.open", nav).forEach((li) => li.classList.remove("open"));
      syncScrollLock();
    };

    toggle.addEventListener("click", () => {
      closeSearch();
      setNav(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", (e) => {
      if (!mobile.matches) return;
      const caret = e.target.closest(".caret");
      if (caret) {
        // chevron expands the submenu, the label still navigates
        e.preventDefault();
        caret.closest(".nav-item").classList.toggle("open");
        return;
      }
      if (e.target.closest("a")) setNav(false);
    });

    document.body.addEventListener("click", (e) => {
      // tap on the dimmed page closes the menu
      if (
        document.body.classList.contains("nav-open") &&
        !e.target.closest("#main-nav, #nav-toggle")
      )
        setNav(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNav(false);
    });
    mobile.addEventListener("change", () => setNav(false));

    // Highlight current page
    const page = (
      location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();
    const current = page === "productdetail.html" ? "shop.html" : page;
    $$(".nav-link[data-page]", nav).forEach((a) => {
      const on = a.dataset.page === current;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
    });

    const onScroll = () =>
      header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ==================================================================
     SEARCH
     ================================================================== */
  let closeSearch = () => {};
  function initSearch() {
    const overlay = $("#search-overlay");
    const toggle = $("#search-toggle");
    const input = $("#search-input");
    const results = $("#search-results");
    const form = $("#search-form");
    const closeBtn = $("#search-close-btn");
    if (!overlay || !toggle || !input) return;

    const setOpen = (open) => {
      overlay.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
      else {
        input.value = "";
        results.hidden = true;
        results.innerHTML = "";
      }
    };
    closeSearch = () => setOpen(false);

    toggle.addEventListener("click", () =>
      setOpen(!overlay.classList.contains("active")),
    );
    closeBtn.addEventListener("click", () => {
      setOpen(false);
      toggle.focus();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active"))
        setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (
        overlay.classList.contains("active") &&
        !e.target.closest("#search-overlay, #search-toggle, [data-add-to-cart]")
      )
        setOpen(false);
    });

    const render = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      const words = q.split(/\s+/);
      const hits = CATALOG.filter((p) =>
        words.every((w) => (p.title + " " + p.name).toLowerCase().includes(w)),
      );
      results.hidden = false;
      if (!hits.length) {
        results.innerHTML = `<p class="search-empty"><i class="bi bi-search"></i> No products match &ldquo;${esc(input.value.trim())}&rdquo;. Try &ldquo;floor&rdquo;, &ldquo;toilet&rdquo; or &ldquo;eraser&rdquo;.</p>`;
        return;
      }
      results.innerHTML =
        hits
          .slice(0, 6)
          .map(
            (p) => `
        <div class="search-result">
          <img src="${esc(p.image)}" alt="" loading="lazy" />
          <div class="search-result-info">
            <p class="search-result-title">${esc(p.title)}</p>
            <p class="search-result-price">${money(p.price)}${p.mrp ? ` <del>${money(p.mrp)}</del>` : ""}</p>
          </div>
          <button type="button" class="search-add" data-add-to-cart data-name="${esc(p.name)}" data-price="${p.price}" data-image="${esc(p.image)}" aria-label="Add ${esc(p.title)} to cart"><i class="bi bi-plus-lg"></i> Add</button>
        </div>`,
          )
          .join("") +
        `<a class="search-all" href="shop.html?q=${encodeURIComponent(input.value.trim())}">See all results in shop <i class="bi bi-arrow-right"></i></a>`;
    };

    input.addEventListener("input", render);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) location.href = `shop.html?q=${encodeURIComponent(q)}`;
    });
  }

  /* ==================================================================
     CART
     ================================================================== */
  const Cart = {
    items: [],
    load() {
      const data = read(CONFIG.cartKey, []);
      this.items = Array.isArray(data)
        ? data.filter((i) => i && i.id && i.price > 0 && i.qty > 0)
        : [];
    },
    save() {
      write(CONFIG.cartKey, this.items);
    },
    count() {
      return this.items.reduce((n, i) => n + i.qty, 0);
    },
    add(item, qty = 1) {
      const existing = this.items.find((i) => i.id === item.id);
      if (existing) existing.qty = Math.min(CONFIG.maxQty, existing.qty + qty);
      else this.items.push({ ...item, qty: Math.min(CONFIG.maxQty, qty) });
      this.save();
    },
    setQty(id, qty) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;
      item.qty = Math.max(1, Math.min(CONFIG.maxQty, qty));
      this.save();
    },
    remove(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.save();
    },
    clear() {
      this.items = [];
      this.save();
    },
    totals() {
      const subtotal = this.items.reduce((s, i) => s + i.price * i.qty, 0);
      const rate = subtotal >= 699 ? 0.15 : subtotal >= 499 ? 0.1 : 0;
      const discount = Math.round(subtotal * rate);
      const shipping =
        !subtotal || subtotal >= CONFIG.freeShippingFrom
          ? 0
          : CONFIG.shippingFee;
      return {
        subtotal,
        rate,
        discount,
        shipping,
        gift: subtotal >= 399,
        total: subtotal - discount + shipping,
      };
    },
  };

  function initCart() {
    const drawer = $("#cart-drawer");
    const backdrop = $("#cart-backdrop");
    const toggle = $("#cart-toggle");
    const closeBtn = $("#cart-close");
    if (!drawer || !toggle) return;

    const els = {
      badge: $("#cart-count"),
      headCount: $("#cart-head-count"),
      reward: $("#cart-reward"),
      body: $("#cart-items"),
      foot: $("#cart-foot"),
      subtotal: $("#cart-subtotal"),
      discountRow: $("#cart-discount-row"),
      discountLabel: $("#cart-discount-label"),
      discount: $("#cart-discount"),
      giftRow: $("#cart-gift-row"),
      shipping: $("#cart-shipping"),
      total: $("#cart-total"),
      clear: $("#cart-clear"),
    };

    let lastFocus = null;

    const open = () => {
      closeSearch();
      lastFocus = document.activeElement;
      drawer.classList.add("open");
      backdrop.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("cart-open");
      syncScrollLock();
      setTimeout(() => closeBtn.focus(), 50);
    };
    const close = () => {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("cart-open");
      syncScrollLock();
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    };
    Cart.open = open;

    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (!drawer.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        // keep focus inside the drawer
        const f = $$("button:not([disabled]), a[href]", drawer).filter(
          (n) => n.offsetParent !== null,
        );
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* --- render --- */
    function render(focusKey) {
      const count = Cart.count();
      const t = Cart.totals();

      els.badge.textContent = count > 99 ? "99+" : count;
      els.badge.classList.toggle("has-items", count > 0);
      els.headCount.textContent = count;
      els.headCount.hidden = count === 0;
      els.reward.hidden = els.foot.hidden = count === 0;

      if (!count) {
        els.body.innerHTML = `
        <style> .cart-body {width: 100%; height: 100vh} </style>
          <div class="cart-empty">
            <div class="cart-empty-icon"><i class="bi bi-bag"></i></div>
            <h3>Your cart is empty</h3>
            <p>Add a few essentials and they will show up here.</p>
            <a href="shop.html" class="cart-empty-cta">Start shopping</a>
          </div>`;
        return;
      }

      /* reward progress */
      const top = REWARDS[REWARDS.length - 1].at;
      const next = REWARDS.find((r) => t.subtotal < r.at);
      const pct = Math.min(100, (t.subtotal / top) * 100);
      els.reward.innerHTML = `
        <p class="reward-msg">${
          next
            ? `Add <strong>${money(next.at - t.subtotal)}</strong> more to unlock <strong>${next.label}</strong>`
            : `<i class="bi bi-check-circle-fill"></i> You have unlocked every reward`
        }</p>
        <div class="reward-track" role="progressbar" aria-valuemin="0" aria-valuemax="${top}" aria-valuenow="${Math.min(t.subtotal, top)}">
          <span class="reward-fill" style="width:${pct}%"></span>
          ${REWARDS.map((r) => `<span class="reward-stop${t.subtotal >= r.at ? " reached" : ""}" style="left:${(r.at / top) * 100}%" title="${money(r.at)}: ${r.label}"><i class="bi ${r.icon}"></i></span>`).join("")}
        </div>
        <div class="reward-labels">${REWARDS.map((r) => `<span class="${t.subtotal >= r.at ? "reached" : ""}" style="left:${(r.at / top) * 100}%">${money(r.at)}</span>`).join("")}</div>`;

      /* items */
      els.body.innerHTML = `<ul class="cart-list">${Cart.items
        .map(
          (i) => `
        <li class="cart-item" data-id="${esc(i.id)}">
          <img src="${esc(i.image)}" alt="" loading="lazy" />
          <div class="cart-item-main">
            <p class="cart-item-name">${esc(i.title)}</p>
            <p class="cart-item-price">${money(i.price)}${i.mrp > i.price ? ` <del>${money(i.mrp)}</del>` : ""}</p>
            <div class="cart-item-bottom">
              <div class="qty" role="group" aria-label="Quantity for ${esc(i.title)}">
                <button type="button" data-act="dec" aria-label="Decrease quantity"${i.qty <= 1 ? " disabled" : ""}><i class="bi bi-dash"></i></button>
                <span aria-live="polite">${i.qty}</span>
                <button type="button" data-act="inc" aria-label="Increase quantity"${i.qty >= CONFIG.maxQty ? " disabled" : ""}><i class="bi bi-plus"></i></button>
              </div>
              <strong class="cart-item-total">${money(i.price * i.qty)}</strong>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-act="rm" aria-label="Remove ${esc(i.title)}"><i class="bi bi-trash3"></i></button>
        </li>`,
        )
        .join("")}</ul>`;

      /* totals */
      els.subtotal.textContent = money(t.subtotal);
      els.discountRow.hidden = !t.discount;
      els.discountLabel.textContent = `Offer discount (${Math.round(t.rate * 100)}%)`;
      els.discount.textContent = "\u2212" + money(t.discount);
      els.giftRow.hidden = !t.gift;
      els.shipping.textContent = t.shipping ? money(t.shipping) : "Free";
      els.shipping.classList.toggle("is-free", !t.shipping);
      els.total.textContent = money(t.total);

      if (focusKey) {
        const [id, act] = focusKey.split("|");
        const row = $$(".cart-item", els.body).find((r) => r.dataset.id === id);
        const target =
          row &&
          (row.querySelector(`[data-act="${act}"]:not([disabled])`) ||
            row.querySelector('[data-act="inc"]'));
        if (target) target.focus();
      }
    }
    Cart.render = render;

    els.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const row = btn.closest(".cart-item");
      const id = row.dataset.id;
      const item = Cart.items.find((i) => i.id === id);
      if (!item) return;
      const act = btn.dataset.act;
      if (act === "inc") Cart.setQty(id, item.qty + 1);
      if (act === "dec") Cart.setQty(id, item.qty - 1);
      if (act === "rm") Cart.remove(id);
      render(act === "rm" ? null : `${id}|${act}`);
    });

    let clearTimer;
    els.clear.addEventListener("click", () => {
      if (!els.clear.classList.contains("confirm")) {
        els.clear.classList.add("confirm");
        els.clear.innerHTML =
          '<i class="bi bi-exclamation-circle"></i> Tap again to clear';
        clearTimer = setTimeout(resetClear, 3000);
        return;
      }
      resetClear();
      Cart.clear();
      render();
    });
    function resetClear() {
      clearTimeout(clearTimer);
      els.clear.classList.remove("confirm");
      els.clear.innerHTML = '<i class="bi bi-trash3"></i> Clear cart';
    }

    // els.checkout.addEventListener('click', () => {
    //   if (!Cart.items.length) return;
    //   const t = Cart.totals();
    //   const lines = Cart.items.map((i, n) => `${n + 1}. ${i.title} \u00D7 ${i.qty} \u2014 ${money(i.price * i.qty)}`);
    //   const msg = [
    //     'Hi Bhawani! I would like to place an order:', '',
    //     ...lines, '',
    //     `Subtotal: ${money(t.subtotal)}`,
    //     t.discount ? `Offer discount (${Math.round(t.rate * 100)}%): -${money(t.discount)}` : null,
    //     t.gift ? 'Free gift: included' : null,
    //     `Shipping: ${t.shipping ? money(t.shipping) : 'Free'}`,
    //     `Total: ${money(t.total)}`, '',
    //     'Please confirm availability, delivery address and payment details.'
    //   ].filter(l => l !== null).join('\n');
    //   window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    // });

    // Keep several tabs in sync
    window.addEventListener("storage", (e) => {
      if (e.key === CONFIG.cartKey) {
        Cart.load();
        render();
      }
    });

    Cart.load();
    render();
  }

  /* Add an item to the cart and give feedback */
  function addToCart(item, qty = 1, { openDrawer = true, button = null } = {}) {
    Cart.add(item, qty);
    if (Cart.render) Cart.render();
    const badge = $("#cart-count");
    if (badge) {
      badge.classList.remove("bump");
      void badge.offsetWidth;
      badge.classList.add("bump");
    }

    if (button && !button.classList.contains("is-added")) {
      const original = button.innerHTML;
      button.classList.add("is-added");
      button.innerHTML = '<i class="bi bi-check2"></i> Added';
      setTimeout(() => {
        button.classList.remove("is-added");
        button.innerHTML = original;
      }, 1400);
    }
    if (openDrawer && Cart.open) Cart.open();
    else toast("Added to cart", "bi-bag-check-fill");
  }

  function itemFromButton(btn) {
    const d = btn.dataset;
    const known = findProduct(d.name);
    const card = btn.closest(".product-card, .me-variant-card");
    const cardImg = card && $("img", card);
    const mrpEl = card && $(".regular-price", card);
    return {
      id: slug(d.name),
      title: known ? known.title : d.name,
      price: Number(d.price),
      mrp: mrpEl
        ? Number(mrpEl.textContent.replace(/[^\d]/g, ""))
        : known
          ? known.mrp
          : 0,
      image:
        d.image ||
        (known && known.image) ||
        (cardImg && cardImg.getAttribute("src")) ||
        "",
    };
  }

  function initAddToCart() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add-to-cart]");
      if (!btn) return;
      e.preventDefault();
      if (!btn.dataset.name || !(Number(btn.dataset.price) > 0)) return;
      const inSearch = !!btn.closest(".search-result");
      addToCart(itemFromButton(btn), 1, { button: btn, openDrawer: !inSearch });
    });
  }

  /* ==================================================================
     WISHLIST
     ================================================================== */
  function initWishlist() {
    const saved = new Set(read(CONFIG.wishKey, []));
    const keyFor = (btn) => {
      const card = btn.closest(".product-card");
      const name = card && $(".product-name", card);
      return name ? slug(name.textContent) : "product-detail";
    };
    const paint = (btn, on) => {
      btn.classList.toggle("liked", on);
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
      const i = $("i", btn);
      if (i) i.className = on ? "bi bi-heart-fill" : "bi bi-heart";
    };
    $$(".wishlist-btn, .bh-wishlist").forEach((btn) => {
      btn.dataset.wishKey =
        btn.id === "wishlistBtn"
          ? slug($(".bh-product-info h1")?.textContent || "product-detail")
          : keyFor(btn);
      paint(btn, saved.has(btn.dataset.wishKey));
    });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".wishlist-btn, .bh-wishlist");
      if (!btn) return;
      const key = btn.dataset.wishKey;
      const on = !saved.has(key);
      on ? saved.add(key) : saved.delete(key);
      write(CONFIG.wishKey, [...saved]);
      paint(btn, on);
      toast(
        on ? "Saved to wishlist" : "Removed from wishlist",
        on ? "bi-heart-fill" : "bi-heart",
      );
    });
  }

  /* ==================================================================
     CATEGORY PILLS (drag to scroll + highlight)
     ================================================================== */
  function initCategoryPills() {
    const wrap = $("#category-pills");
    if (!wrap) return;
    let down = false,
      startX = 0,
      startLeft = 0,
      moved = false;
    wrap.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = wrap.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        wrap.classList.add("dragging");
      }
      wrap.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", () => {
      down = false;
      wrap.classList.remove("dragging");
    });
    wrap.addEventListener("click", (e) => {
      if (moved) {
        e.preventDefault();
        moved = false;
      }
    });

    const mark = () => {
      const here =
        (location.pathname.split("/").pop() || "") === "shop.html"
          ? location.hash
          : null;
      $$(".pill", wrap).forEach((p) =>
        p.classList.toggle(
          "active",
          !!here && p.getAttribute("href").endsWith(here),
        ),
      );
    };
    mark();
    window.addEventListener("hashchange", mark);
  }

  /* ==================================================================
     SCROLL REVEAL + PROGRESS BAR
     ================================================================== */
  function initReveal() {
    const targets = $$(".reveal, .stagger-children");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    targets.forEach((t) => io.observe(t));
  }

  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (window.scrollY / max) * 100 + "%" : "0%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ==================================================================
     SHOP: filters, sort, search query
     ================================================================== */
  function initShop() {
    const main = $("#shop-main");
    const sidebar = $("#shop-sidebar");
    if (!main || !sidebar) return;

    const countEl = $("#shop-count");
    const sortEl = $("#sort-select");
    const toggle = $("#filter-toggle");
    const grids = $$(".shop-grid", main);

    const cards = $$(".product-card", main).map((el, index) => {
      const btn = $("[data-add-to-cart]", el);
      const grid = el.closest(".shop-grid");
      const rating = (
        $(".product-rating", el)?.textContent.match(/\u2605/g) || []
      ).length;
      const votes = ($(".rating-count", el)?.textContent || "").match(
        /([\d.]+)(k?)/i,
      );
      return {
        el,
        grid,
        index,
        title: ($(".product-name", el)?.textContent || "").trim(),
        price: Number(btn?.dataset.price || 0),
        section: grid ? grid.id : "",
        rating:
          rating * 100000 +
          (votes ? parseFloat(votes[1]) * (votes[2] ? 1000 : 1) : 0),
      };
    });

    const rules = {
      "All Products": () => true,
      "Appliance Cleaners": (c) =>
        /washing machine|descaler|tablet/i.test(c.title),
      "Floor Cleaners": (c) =>
        c.section === "floor-grid" || /floor/i.test(c.title),
      "Kitchen Cleaners": (c) =>
        c.section === "kitchen-grid" || /kitchen|degreaser/i.test(c.title),
      "Toilet & Bathroom": (c) =>
        c.section === "toilet-grid" || /toilet|bathroom/i.test(c.title),
      "Dishwash Liquids": (c) => /dish/i.test(c.title),
      "Air Fresheners": (c) =>
        /adeha|room (spray|freshener)|mist/i.test(c.title),
      Combos: (c) =>
        c.section === "combos-shop-grid" || /combo|kit/i.test(c.title),
      "Mega Saver 5L": (c) => /\b5l\b/i.test(c.title),
      "Under \u20B9199": (c) => c.price <= 199,
      "\u20B9200 \u2013 \u20B9399": (c) => c.price >= 200 && c.price <= 399,
      "\u20B9400 \u2013 \u20B9699": (c) => c.price >= 400 && c.price <= 699,
      "Above \u20B9700": (c) => c.price >= 700,
      Rose: (c) => /rose/i.test(c.title),
      "Citrus / Lemon": (c) => /citrus|lemon/i.test(c.title),
      Floral: (c) => /floral/i.test(c.title),
      Tropical: (c) => /tropical/i.test(c.title),
      "Fragrance-Free": (c) =>
        !/rose|citrus|lemon|floral|tropical|lavender/i.test(c.title),
      "Single Pack": (c) =>
        !/combo|kit|\b[2-9]\s?pc|pack of|x\s?3|pouches|\b5l\b/i.test(c.title),
      "Pack of 2-3": (c) =>
        /combo|\b[23]\s?pc|pack of [23]\b|x\s?3|3 pouches/i.test(c.title),
      "Pack of 4-6": (c) => /\b[4-6]\s?pc|pack of [4-6]\b/i.test(c.title),
      "5L Bulk": (c) => /\b5l\b/i.test(c.title),
    };

    const groups = $$(".filter-group", sidebar).map((g) => ({
      boxes: $$('input[type="checkbox"]', g).map((input) => ({
        input,
        label: input.parentElement.textContent.trim(),
      })),
    }));

    const query = (new URLSearchParams(location.search).get("q") || "")
      .trim()
      .toLowerCase();

    const apply = () => {
      const sorted = sortEl ? sortEl.value : "featured";
      let visible = 0;

      cards.forEach((c) => {
        let show = groups.every((g) => {
          const active = g.boxes.filter(
            (b) => b.input.checked && b.label !== "All Products",
          );
          return (
            !active.length ||
            active.some((b) => (rules[b.label] || (() => true))(c))
          );
        });
        if (show && query)
          show = query
            .split(/\s+/)
            .every((w) => c.title.toLowerCase().includes(w));
        c.el.hidden = !show;
        if (show) visible++;
      });

      grids.forEach((grid) => {
        const mine = cards.filter((c) => c.grid === grid);
        const order = [...mine];
        if (sorted === "price-asc") order.sort((a, b) => a.price - b.price);
        if (sorted === "price-desc") order.sort((a, b) => b.price - a.price);
        if (sorted === "rating") order.sort((a, b) => b.rating - a.rating);
        if (sorted === "new") order.sort((a, b) => b.index - a.index);
        if (sorted === "featured") order.sort((a, b) => a.index - b.index);
        order.forEach((c) => grid.appendChild(c.el));
        const heading = grid.previousElementSibling;
        const any = mine.some((c) => !c.el.hidden);
        grid.hidden = !any;
        if (heading && heading.tagName === "H2") heading.hidden = !any;
      });

      if (countEl) {
        countEl.textContent = query
          ? `${visible} result${visible === 1 ? "" : "s"} for \u201C${query}\u201D`
          : `Showing ${visible} product${visible === 1 ? "" : "s"}`;
      }

      let empty = $("#shop-empty");
      if (!visible && !empty) {
        empty = document.createElement("div");
        empty.className = "shop-empty";
        empty.id = "shop-empty";
        empty.innerHTML =
          '<div><i class="bi bi-search"></i></div><h3>No products found</h3><p>Try removing a filter or searching for something else.</p><button type="button" class="hero-cta" id="shop-reset">Reset filters</button>';
        main.appendChild(empty);
      }
      if (empty) empty.hidden = visible > 0;
    };

    sidebar.addEventListener("change", (e) => {
      const input = e.target;
      if (input.type !== "checkbox") return;
      const group = groups.find((g) => g.boxes.some((b) => b.input === input));
      const meta = group.boxes.find((b) => b.input === input);
      if (meta.label === "All Products" && input.checked)
        group.boxes.forEach((b) => {
          if (b.input !== input) b.input.checked = false;
        });
      else if (input.checked) {
        const all = group.boxes.find((b) => b.label === "All Products");
        if (all) all.input.checked = false;
      }
      const all = group.boxes.find((b) => b.label === "All Products");
      if (all && !group.boxes.some((b) => b.input.checked))
        all.input.checked = true;
      apply();
    });

    main.addEventListener("click", (e) => {
      if (!e.target.closest("#shop-reset")) return;
      groups.forEach((g) =>
        g.boxes.forEach((b) => {
          b.input.checked = b.label === "All Products";
        }),
      );
      history.replaceState(null, "", location.pathname);
      location.reload();
    });

    if (sortEl) sortEl.addEventListener("change", apply);
    if (toggle)
      toggle.addEventListener("click", () => {
        const open = sidebar.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });

    // Header links like shop.html#appliance: filter when there is no matching section on the page
    const hashFilters = {
      "#appliance": "Appliance Cleaners",
      "#dishwash": "Dishwash Liquids",
      "#air": "Air Fresheners",
      "#mega-saver": "Mega Saver 5L",
    };
    const fromHash = () => {
      const label = hashFilters[location.hash];
      if (!label || document.getElementById(location.hash.slice(1))) return;
      groups[0].boxes.forEach((b) => {
        b.input.checked = b.label === label;
      });
      apply();
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", fromHash);
    apply();
    fromHash();
  }

  /* ==================================================================
     ACCORDIONS (FAQ page, contact FAQ, Magic Eraser FAQ)
     ================================================================== */
  function initAccordions() {
    document.addEventListener("click", (e) => {
      const q = e.target.closest(".faq-acc-q, .faq-question, .me-faq-q");
      if (!q) return;
      const item = q.closest(".faq-acc-item, .faq-item, .me-faq-item");
      if (!item) return;
      const open = item.classList.toggle("open");
      if (q.tagName === "BUTTON") q.setAttribute("aria-expanded", String(open));
    });
    $$(".faq-acc-q").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }

  function initFaqPage() {
    const list = $("#faq-list");
    if (!list) return;
    const items = $$(".faq-acc-item", list);
    const titles = $$(".faq-group-title", list);
    const tabs = $$(".faq-tab");
    const search = $("#faq-search");
    const empty = $("#faq-empty");
    let cat = "all";

    const apply = () => {
      const q = (search?.value || "").trim().toLowerCase();
      let shown = 0;
      items.forEach((it) => {
        const match =
          (cat === "all" || it.dataset.cat === cat) &&
          (!q || it.textContent.toLowerCase().includes(q));
        it.hidden = !match;
        if (match) shown++;
      });
      titles.forEach((t) => {
        t.hidden = !items.some(
          (it) => it.dataset.cat === t.dataset.cat && !it.hidden,
        );
      });
      if (empty) empty.hidden = shown > 0;
    };

    tabs.forEach((tab) =>
      tab.addEventListener("click", () => {
        cat = tab.dataset.cat;
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", String(on));
        });
        apply();
      }),
    );
    if (search) search.addEventListener("input", apply);

    // open the question linked from the URL hash
    const target = location.hash && $(location.hash);
    if (target) {
      const item = target.closest(".faq-acc-item");
      if (item) item.classList.add("open");
    }
  }

  /* ==================================================================
     LEGAL PAGES: table of contents + print
     ================================================================== */
  function initLegal() {
    const links = $$(".legal-toc a");
    const print = $("#legal-print");
    if (print) print.addEventListener("click", () => window.print());
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = [...map.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.classList.remove("active"));
          map.get(en.target.id)?.classList.add("active");
        });
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ==================================================================
     BRANDS: quick nav highlight
     ================================================================== */
  function initBrandsNav() {
    const links = $$(".brands-nav-link");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + en.target.id,
            ),
          );
        });
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    $$(".brand-section").forEach((s) => io.observe(s));
  }

  /* ==================================================================
     PRODUCT DETAIL PAGE
     ================================================================== */
  function initProductDetail() {
    const addBtn = $("#addToCart");
    if (!addBtn) return;

    const qtyEl = $("#quantity");
    const mainImg = $("#mainImage");
    let qty = 1;
    const setQty = (n) => {
      qty = Math.max(1, Math.min(CONFIG.maxQty, n));
      qtyEl.textContent = qty;
    };
    $("#minusBtn").addEventListener("click", () => setQty(qty - 1));
    $("#plusBtn").addEventListener("click", () => setQty(qty + 1));

    $$(".bh-thumbnails img").forEach((img) =>
      img.addEventListener("click", () => {
        $$(".bh-thumbnails img").forEach((i) => i.classList.remove("active"));
        img.classList.add("active");
        mainImg.src = img.src;
      }),
    );

    const current = () => {
      const title = $(".bh-product-info h1").textContent.trim();
      const price = Number(
        $(".bh-price strong").textContent.replace(/[^\d]/g, ""),
      );
      const mrp =
        Number(($(".bh-price del")?.textContent || "").replace(/[^\d]/g, "")) ||
        0;
      const known = CATALOG.find((p) => p.title === title);
      return {
        id: known ? slug(known.name) : slug(title),
        title,
        price,
        mrp,
        image: (known && known.image) || mainImg.getAttribute("src"),
      };
    };

    addBtn.addEventListener("click", () =>
      addToCart(current(), qty, { button: addBtn }),
    );
    $("#buyNow").addEventListener("click", () => addToCart(current(), qty));

    // Tabs
    const tabButtons = $$(".bh-tab-buttons button");
    tabButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
        $$(".bh-tab-panel").forEach((p) =>
          p.classList.toggle("active", p.id === btn.dataset.tab),
        );
      }),
    );
    document.addEventListener("click", (e) => {
      // "2,148 Reviews" link opens the reviews tab
      const link = e.target.closest(
        'a[href="#bh-reviews"], a[href="#reviews"]',
      );
      if (!link) return;
      e.preventDefault();
      $('[data-tab="reviews"]')?.click();
      $(".bh-product-tabs")?.scrollIntoView({ behavior: "smooth" });
    });

    // Review form
    const form = $("#reviewForm");
    const list = $("#reviewList");
    if (form && list)
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("#reviewName").value.trim();
        const text = $("#reviewText").value.trim();
        const stars = Number($("#reviewRating").value);
        if (!name || !text) return;
        list.insertAdjacentHTML(
          "afterbegin",
          `
        <div class="bh-demo-review">
          <div class="bh-demo-review-header">
            <div class="bh-demo-avatar">${esc(name.charAt(0).toUpperCase())}</div>
            <div><h4>${esc(name)}</h4><span>Customer</span></div>
            <small>Just now</small>
          </div>
          <div class="bh-demo-stars">${"\u2605".repeat(stars)}${"\u2606".repeat(5 - stars)}</div>
          <p>${esc(text)}</p>
        </div>`,
        );
        form.reset();
        toast("Thanks! Your review has been posted");
      });
  }

  /* ==================================================================
     FORMS: newsletter + contact
     ================================================================== */
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function initForms() {
    const newsletter = $("#newsletter-form");
    if (newsletter)
      newsletter.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("#newsletter-email");
        const ok = validEmail(input.value.trim());
        input.setAttribute("aria-invalid", String(!ok));
        if (!ok) {
          input.focus();
          toast(
            "Please enter a valid email address",
            "bi-exclamation-circle-fill",
          );
          return;
        }
        newsletter.reset();
        toast("You are subscribed. Welcome to the family!");
      });

    const contact = $("#contact-form");
    if (contact) {
      contact.addEventListener("submit", (e) => {
        e.preventDefault();
        let firstBad = null;
        $$("[required]", contact).forEach((field) => {
          const v = field.value.trim();
          const bad = !v || (field.type === "email" && !validEmail(v));
          field.setAttribute("aria-invalid", String(bad));
          if (bad && !firstBad) firstBad = field;
        });
        if (firstBad) {
          firstBad.focus();
          toast(
            "Please fill in the highlighted fields",
            "bi-exclamation-circle-fill",
          );
          return;
        }
        contact.reset();
        toast(
          "Message sent. We will reply within 24 hours.",
          "bi-send-check-fill",
        );
      });
      contact.addEventListener("input", (e) => {
        if (e.target.getAttribute("aria-invalid") === "true")
          e.target.setAttribute("aria-invalid", "false");
      });
    }
  }

  /* ==================================================================
     BOOT
     ================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    // Things that do not depend on the header/footer includes
    initAddToCart();
    initAccordions();
    initFaqPage();
    initLegal();
    initBrandsNav();
    initShop();
    initProductDetail();
    initForms();
    initReveal();
    initScrollProgress();

    Promise.all([
      include("include/header.html", $("#header")),
      include("include/footer.html", $("#footerId")),
    ]).then(() => {
      initHeader();
      initSearch();
      initCart();
      initCategoryPills();
      initWishlist();
    });
  });
})();
