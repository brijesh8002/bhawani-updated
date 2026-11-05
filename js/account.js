/* Bhawani – Checkout + Account (localStorage demo; swap store calls for your API) */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "\u20B9" + Math.round(n).toLocaleString("en-IN");
  const esc = (s) =>
    String(s ?? "").replace(
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
  const rd = (k, f) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? f;
    } catch {
      return f;
    }
  };
  const wr = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
  const K = {
    cart: "bhawani_cart_v1",
    orders: "bhawani_orders_v1",
    profile: "bhawani_profile_v1",
    login: "bhawani_logged_in",
  };
  const IMG = {
    a: "images/product-floor-cleaner.jpg",
    b: "images/combo-bathroom.jpg",
    c: "images/product-dishwash.jpg",
    d: "images/combo-room-spray.jpg",
    e: "images/product-magic-eraser.jpg",
    f: "images/combo-trial-kit.jpg",
  };
  const STAGES = [
    ["Order placed", "bi-bag-check"],
    ["Packed", "bi-box-seam"],
    ["Shipped", "bi-truck"],
    ["Out for delivery", "bi-geo-alt"],
    ["Delivered", "bi-house-check"],
  ];
  const day = (n) => {
    const d = new Date(Date.now() - n * 864e5);
    return d.toISOString();
  };
  const fmt = (iso, t) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...(t ? { hour: "2-digit", minute: "2-digit" } : {}),
    });

  const defProfile = {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    dob: "",
    gender: "",
    addresses: [
      {
        id: 1,
        label: "Home",
        line: "B-42, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pin: "201301",
        def: true,
      },
    ],
  };
  const profile = () => rd(K.profile, defProfile);
  const seed = () => [
    {
      id: "BHW10482",
      date: day(2),
      stage: 2,
      status: "shipped",
      pay: "UPI",
      items: [
        {
          title: "Toilet + Bathroom Cleaner Combo",
          price: 299,
          qty: 1,
          image: IMG.b,
        },
        {
          title: "Natural Dishwash Liquid 1L",
          price: 299,
          qty: 2,
          image: IMG.c,
        },
      ],
      shipping: 0,
      discount: 90,
      awb: "BHD7741920331",
    },
    {
      id: "BHW10377",
      date: day(12),
      stage: 4,
      status: "delivered",
      pay: "COD",
      items: [
        { title: "Floor Cleaner 850ml", price: 269, qty: 2, image: IMG.a },
      ],
      shipping: 0,
      discount: 0,
      awb: "BHD7739011874",
    },
    {
      id: "BHW10211",
      date: day(31),
      stage: 4,
      status: "delivered",
      pay: "Card",
      items: [
        { title: "Home Care Trial Kit", price: 499, qty: 1, image: IMG.f },
        { title: "Magic Eraser Sponge 4pc", price: 299, qty: 1, image: IMG.e },
      ],
      shipping: 0,
      discount: 80,
      awb: "BHD7731290456",
    },
    {
      id: "BHW10098",
      date: day(52),
      stage: 0,
      status: "cancelled",
      pay: "UPI",
      items: [
        { title: "Adeha Room Spray B2G1", price: 398, qty: 1, image: IMG.d },
      ],
      shipping: 0,
      discount: 0,
      awb: "",
    },
  ];
  const orders = () => {
    let o = rd(K.orders, null);
    if (!o) {
      o = seed();
      wr(K.orders, o);
    }
    return o;
  };
  const oTotal = (o) =>
    o.items.reduce((s, i) => s + i.price * i.qty, 0) -
    (o.discount || 0) +
    (o.shipping || 0);
  const oQty = (o) => o.items.reduce((s, i) => s + i.qty, 0);
  const badge = (s) =>
    `<span class="badge b-${s}"><i class="bi ${s === "delivered" ? "bi-check-circle-fill" : s === "cancelled" ? "bi-x-circle-fill" : s === "shipped" ? "bi-truck" : "bi-hourglass-split"}"></i>${s[0].toUpperCase() + s.slice(1)}</span>`;
  const toast = (m, i = "bi-check-circle-fill") => {
    const e = $("#toast");
    if (!e) return;
    e.innerHTML = `<i class="bi ${i}"></i><span>${esc(m)}</span>`;
    e.classList.add("show");
    setTimeout(() => e.classList.remove("show"), 2600);
  };
  const initials = (n) =>
    n
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  const page = document.body.dataset.acc;

  /* ---------- Account shell ---------- */
  function shell(active, title, sub, render) {
    const p = profile(),
      os = orders();
    const nav = [
      ["dashboard", "bi-grid-1x2", "Dashboard", "account-dashboard.html"],
      ["orders", "bi-bag-check", "My Orders", "account-orders.html"],
      ["tracking", "bi-truck", "Track Order", "account-tracking.html"],
      [
        "profile",
        "bi-person-gear",
        "Profile & Addresses",
        "account-profile.html",
      ],
      // ["wish", "bi-heart", "Wishlist", "wishlist.html"],
      ["help", "bi-headset", "Help & Support", "contact.html"],
    ];
    $("#acc-root").innerHTML = `
    <section class="acc-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> / <a href="account-dashboard.html">Account</a> / ${esc(title)}</div><h1>${title}</h1><p>${sub}</p></div></section>
    <div class="container acc-wrap"><aside class="acc-side"><div class="acc-user"><div class="avatar">${esc(initials(p.name))}</div><div><strong>${esc(p.name)}</strong><small>${esc(p.email)}</small><span class="tier"><i class="bi bi-stars"></i> ${os.filter((o) => o.status === "delivered").length >= 2 ? "Gold Family" : "Silver Family"}</span></div></div>
    <nav class="acc-nav">${nav.map((n) => `<a href="${n[3]}" class="${n[0] === active ? "active" : ""}"><i class="bi ${n[1]}"></i>${n[2]}</a>`).join("")}<a href="#" class="logout" id="logout"><i class="bi bi-box-arrow-right"></i>Logout</a></nav></aside>
    <div id="acc-main"></div></div>`;
    $("#logout").onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem(K.login);
      toast("Logged out", "bi-box-arrow-right");
      setTimeout(() => (location.href = "index.html"), 700);
    };
    render($("#acc-main"), p, os);
  }
  const orderRow = (o) =>
    `<tr><td><a href="account-order-detail.html?id=${o.id}"><b>#${o.id}</b></a></td><td>${fmt(o.date)}</td><td><div class="thumbs">${o.items
      .slice(0, 3)
      .map((i) => `<img src="${esc(i.image)}" alt="" loading="lazy">`)
      .join(
        "",
      )}</div></td><td>${badge(o.status)}</td><td><b>${money(oTotal(o))}</b></td><td><a class="btn-o" href="account-order-detail.html?id=${o.id}">View</a></td></tr>`;
  const orderCard = (o) =>
    `<div class="o-card"><div class="top"><b>#${o.id}</b>${badge(o.status)}</div><div class="thumbs">${o.items
      .slice(0, 4)
      .map((i) => `<img src="${esc(i.image)}" alt="">`)
      .join(
        "",
      )}</div><div class="bot"><div><small>${fmt(o.date)} · ${oQty(o)} items</small><br><b>${money(oTotal(o))}</b></div><a class="btn-o" href="account-order-detail.html?id=${o.id}">View</a></div></div>`;

  /* ---------- Dashboard ---------- */
  const dashboard = () =>
    shell(
      "dashboard",
      "My Dashboard",
      "Your Bhawani account at a glance",
      (m, p, os) => {
        const spent = os
            .filter((o) => o.status !== "cancelled")
            .reduce((s, o) => s + oTotal(o), 0),
          live = os.find(
            (o) => o.status === "shipped" || o.status === "processing",
          );
        const pts = Math.round(spent / 10),
          pct = Math.min(100, (spent / 3000) * 100);
        m.innerHTML = `<div class="card welcome"><div><h2>Namaste, ${esc(p.name.split(" ")[0])} 👋</h2><p style="color:#555">You're ${money(Math.max(0, 3000 - spent))} away from Platinum Family perks.</p><div class="bar"><i style="width:${pct}%"></i></div></div><a class="btn-g" href="shop.html"><i class="bi bi-bag-plus"></i> Shop again</a></div>
    <div class="stats"><div class="stat"><div class="ico"><i class="bi bi-bag-check"></i></div><div><b>${os.length}</b><span>Total orders</span></div></div><div class="stat"><div class="ico"><i class="bi bi-wallet2"></i></div><div><b>${money(spent)}</b><span>Total spent</span></div></div><div class="stat"><div class="ico"><i class="bi bi-gift"></i></div><div><b>${pts}</b><span>Reward points</span></div></div><div class="stat"><div class="ico"><i class="bi bi-truck"></i></div><div><b>${os.filter((o) => o.status === "shipped" || o.status === "processing").length}</b><span>In transit</span></div></div></div>
    <div class="two"><div>${live ? `<div class="card"><div class="card-h"><h3>Live order · #${live.id}</h3><a href="account-tracking.html?id=${live.id}">Track <i class="bi bi-arrow-right"></i></a></div>${badge(live.status)}<div class="hbar">${STAGES.map((s, i) => `<i class="${i <= live.stage ? "on" : ""}"></i>`).join("")}</div><small style="color:#777">${STAGES[live.stage][0]} · Expected by ${fmt(new Date(new Date(live.date).getTime() + 5 * 864e5))}</small></div>` : ""}
    <div class="card"><div class="card-h"><h3>Recent orders</h3><a href="account-orders.html">View all</a></div><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>${os.slice(0, 4).map(orderRow).join("")}</tbody></table><div class="o-cards">${os.slice(0, 3).map(orderCard).join("")}</div></div></div>
    <div><div class="card"><div class="card-h"><h3>Default address</h3><a href="account-profile.html#addresses">Manage</a></div>${((a) => (a ? `<p><b>${esc(a.label)}</b><br>${esc(a.line)}, ${esc(a.city)}<br>${esc(a.state)} – ${esc(a.pin)}</p>` : "<p>No address saved.</p>"))(p.addresses.find((a) => a.def) || p.addresses[0])}</div>
    <div class="card" style="background:linear-gradient(135deg,#1b4332,#2d6a4f);color:#fff;border:0"><h3 style="color:#fff">🌿 Refer & earn ₹100</h3><p style="opacity:.85;font-size:.9rem;margin:.4rem 0 1rem">Share code <b style="background:rgba(255,255,255,.15);padding:2px 8px;border-radius:6px">BHAWANI100</b> with friends.</p><button class="btn-g" style="background:var(--clr-accent);color:#1b1b1b" id="copyref"><i class="bi bi-clipboard"></i> Copy code</button></div></div></div>`;
        $("#copyref").onclick = () => {
          navigator.clipboard?.writeText("BHAWANI100");
          toast("Code copied");
        };
      },
    );

  /* ---------- Orders ---------- */
  const ordersPg = () =>
    shell("orders", "My Orders", "Every order, in one place", (m, p, os) => {
      m.innerHTML = `<div class="card"><div class="filters"><input class="search-in" id="oq" placeholder="Search order ID…">${["all", "processing", "shipped", "delivered", "cancelled"].map((s, i) => `<button class="chip ${i ? "" : "on"}" data-f="${s}">${s[0].toUpperCase() + s.slice(1)}</button>`).join("")}</div><div id="olist"></div></div>`;
      let f = "all";
      const draw = () => {
        const q = $("#oq").value.trim().toLowerCase(),
          l = os.filter(
            (o) =>
              (f === "all" || o.status === f) && o.id.toLowerCase().includes(q),
          );
        $("#olist").innerHTML = l.length
          ? `<table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>${l.map(orderRow).join("")}</tbody></table><div class="o-cards">${l.map(orderCard).join("")}</div>`
          : '<div class="empty"><i class="bi bi-inbox"></i>No orders found.</div>';
      };
      $$(".chip").forEach(
        (c) =>
          (c.onclick = () => {
            $$(".chip").forEach((x) => x.classList.remove("on"));
            c.classList.add("on");
            f = c.dataset.f;
            draw();
          }),
      );
      $("#oq").oninput = draw;
      draw();
    });

  /* ---------- Order detail ---------- */
  const detail = () =>
    shell(
      "orders",
      "Order Details",
      "Items, payment and delivery information",
      (m, p, os) => {
        const id = new URLSearchParams(location.search).get("id"),
          o = os.find((x) => x.id === id) || os[0],
          a = o.addr || p.addresses.find((a) => a.def) || p.addresses[0];
        const sub = o.items.reduce((s, i) => s + i.price * i.qty, 0);
        m.innerHTML = `<div class="card"><div class="card-h"><div><h3>Order #${o.id}</h3><small style="color:#777">Placed on ${fmt(o.date, 1)}</small></div>${badge(o.status)}</div>${o.items.map((i) => `<div class="line"><img src="${esc(i.image)}" alt=""><div class="n">${esc(i.title)}<small>Qty ${i.qty} × ${money(i.price)}</small></div><b>${money(i.price * i.qty)}</b></div>`).join("")}</div>
    <div class="two"><div class="card"><div class="card-h"><h3>Delivery & payment</h3></div><div class="grid2"><div><small style="color:#888">SHIPPING TO</small><p><b>${esc(p.name)}</b><br>${esc(a.line)}, ${esc(a.city)}<br>${esc(a.state)} – ${esc(a.pin)}<br>📞 ${esc(p.phone)}</p></div><div><small style="color:#888">PAYMENT</small><p><b>${esc(o.pay)}</b><br>${o.pay === "COD" ? "Pay on delivery" : "Paid online"}${o.awb ? `<br><small>AWB: ${o.awb}</small>` : ""}</p></div></div>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">${o.status !== "cancelled" ? `<a class="btn-g" href="account-tracking.html?id=${o.id}"><i class="bi bi-geo-alt"></i> Track order</a>` : ""}<button class="btn-o" onclick="window.print()"><i class="bi bi-printer"></i> Invoice</button><a class="btn-o" href="contact.html"><i class="bi bi-headset"></i> Need help?</a>${o.status === "processing" || (o.status === "shipped" && o.stage < 2) ? '<button class="btn-d" id="cancel">Cancel order</button>' : ""}</div></div>
    <div class="card sum"><div class="card-h"><h3>Summary</h3></div><div><span>Subtotal</span><span>${money(sub)}</span></div>${o.discount ? `<div class="save"><span>Offer discount</span><span>−${money(o.discount)}</span></div>` : ""}<div><span>Shipping</span><span>${o.shipping ? money(o.shipping) : "Free"}</span></div><div class="tot"><span>Total</span><span>${money(oTotal(o))}</span></div></div></div>`;
        const c = $("#cancel");
        if (c)
          c.onclick = () => {
            o.status = "cancelled";
            wr(K.orders, os);
            toast("Order cancelled");
            setTimeout(() => location.reload(), 700);
          };
      },
    );

  /* ---------- Tracking ---------- */
  const tracking = () =>
    shell(
      "tracking",
      "Track Your Order",
      "Live status from our warehouse to your door",
      (m, p, os) => {
        m.innerHTML = `<div class="card"><form class="trk-form fld" id="tf"><input id="tid" placeholder="Enter order ID e.g. BHW10482" value="${esc(new URLSearchParams(location.search).get("id") || (os.find((o) => o.status === "shipped") || os[0]).id)}"><button class="btn-g" type="submit"><i class="bi bi-search"></i> Track</button></form></div><div id="tres"></div>`;
        const show = () => {
          const o = os.find(
            (x) => x.id.toLowerCase() === $("#tid").value.trim().toLowerCase(),
          );
          const r = $("#tres");
          if (!o) {
            r.innerHTML =
              '<div class="card empty"><i class="bi bi-emoji-frown"></i>No order found with that ID.</div>';
            return;
          }
          if (o.status === "cancelled") {
            r.innerHTML = `<div class="card empty"><i class="bi bi-x-circle"></i>Order #${o.id} was cancelled.</div>`;
            return;
          }
          const times = [
            "Order confirmed",
            "Packed at Noida warehouse",
            "Left sorting hub",
            "Arriving today",
            "Delivered to you",
          ];
          r.innerHTML = `<div class="card"><div class="card-h"><div><h3>Order #${o.id}</h3><small style="color:#777">AWB ${o.awb} · ${oQty(o)} items · ${money(oTotal(o))}</small></div>${badge(o.status)}</div><div class="track">${STAGES.map((s, i) => `<div class="tstep ${i < o.stage || o.status === "delivered" ? "done" : i === o.stage ? "now" : ""}"><div class="dot"><i class="bi ${i < o.stage || o.status === "delivered" ? "bi-check-lg" : s[1]}"></i></div><h4>${s[0]}</h4><p>${i <= o.stage ? times[i] + " · " + fmt(new Date(new Date(o.date).getTime() + i * 36e5 * 14), 1) : "Pending"}</p></div>`).join("")}</div></div>`;
        };
        $("#tf").onsubmit = (e) => {
          e.preventDefault();
          show();
        };
        show();
      },
    );

  /* ---------- Profile ---------- */
  const profilePg = () =>
    shell(
      "profile",
      "Profile & Addresses",
      "Update your details or delete your account",
      (m, p) => {
        m.innerHTML = `<form class="card" id="pf" novalidate><div class="card-h"><h3>Personal information</h3></div><div class="fg">
    ${[
      ["name", "Full name", "text"],
      ["email", "Email", "email"],
      ["phone", "Mobile number", "tel"],
      ["dob", "Date of birth", "date"],
    ]
      .map(
        (f) =>
          `<div class="fld"><label>${f[1]}</label><input name="${f[0]}" type="${f[2]}" value="${esc(p[f[0]])}"><div class="err">Please enter a valid ${f[1].toLowerCase()}</div></div>`,
      )
      .join("")}
    <div class="fld"><label>Gender</label><select name="gender">${["", "Male", "Female", "Other"].map((g) => `<option ${p.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div></div><div style="margin-top:1.2rem"><button class="btn-g" type="submit"><i class="bi bi-check2-circle"></i> Save changes</button></div></form>
    <div class="card" id="addresses"><div class="card-h"><h3>Saved addresses</h3></div><div class="grid2" id="alist"></div><details style="margin-top:1rem"><summary class="btn-o" style="cursor:pointer;list-style:none"><i class="bi bi-plus-lg"></i> Add new address</summary><form id="af" class="fg" style="margin-top:1rem" novalidate>${[
      ["label", "Label (Home/Work)"],
      ["line", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["pin", "PIN code"],
    ]
      .map(
        (f) =>
          `<div class="fld ${f[0] === "line" ? "full" : ""}"><label>${f[1]}</label><input name="${f[0]}"><div class="err">Required</div></div>`,
      )
      .join(
        "",
      )}<div class="full"><button class="btn-g" type="submit">Save address</button></div></form></details></div>
    <div class="card" style="border-color:#f0c9c4"><div class="card-h"><h3 style="color:#c0392b">Danger zone</h3></div><p style="color:#666;font-size:.9rem;margin-bottom:1rem">Deleting your account removes your profile, addresses and order history from this device. This cannot be undone.</p><button class="btn-d" id="del"><i class="bi bi-trash3"></i> Delete my account</button></div>
    <div class="modal-bg" id="dm"><div class="modal"><h3>Delete account?</h3><p>Type <b>DELETE</b> to confirm.</p><div class="fld" style="margin-bottom:1rem"><input id="dc" placeholder="DELETE"></div><div class="row"><button class="btn-o" id="dx">Cancel</button><button class="btn-d" id="dy">Delete forever</button></div></div></div>`;
        const V = {
          name: (v) => v.trim().length > 2,
          email: (v) => /^\S+@\S+\.\S+$/.test(v),
          phone: (v) => /^[6-9]\d{9}$/.test(v),
          dob: () => true,
        };
        $("#pf").onsubmit = (e) => {
          e.preventDefault();
          let ok = true;
          const d = Object.fromEntries(new FormData(e.target));
          $$(".fld", e.target).forEach((f) => {
            const i = $("input", f);
            if (i && V[i.name]) {
              const g = V[i.name](d[i.name]);
              f.classList.toggle("bad", !g);
              ok = ok && g;
            }
          });
          if (!ok)
            return toast(
              "Please fix the highlighted fields",
              "bi-exclamation-circle-fill",
            );
          wr(K.profile, { ...p, ...d });
          toast("Profile updated");
          setTimeout(() => location.reload(), 700);
        };
        const al = () => {
          $("#alist").innerHTML = p.addresses
            .map(
              (a) =>
                `<div class="addr ${a.def ? "def" : ""}">${a.def ? '<span class="badge">Default</span>' : ""}<b>${esc(a.label)}</b><p style="font-size:.9rem;color:#555;margin:.3rem 0 .7rem">${esc(a.line)}, ${esc(a.city)}, ${esc(a.state)} – ${esc(a.pin)}</p>${a.def ? "" : `<button class="btn-o" data-d="${a.id}">Make default</button> `}${p.addresses.length > 1 ? `<button class="btn-d" data-r="${a.id}"><i class="bi bi-trash3"></i></button>` : ""}</div>`,
            )
            .join("");
        };
        const sv = () => {
          wr(K.profile, p);
          al();
        };
        al();
        $("#alist").onclick = (e) => {
          const d = e.target.closest("[data-d]"),
            r = e.target.closest("[data-r]");
          if (d) p.addresses.forEach((a) => (a.def = a.id == d.dataset.d));
          if (r) {
            p.addresses = p.addresses.filter((a) => a.id != r.dataset.r);
            if (!p.addresses.some((a) => a.def)) p.addresses[0].def = true;
          }
          if (d || r) {
            sv();
            toast("Addresses updated");
          }
        };
        $("#af").onsubmit = (e) => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(e.target));
          let ok = true;
          $$(".fld", e.target).forEach((f) => {
            const g = $("input", f).value.trim() !== "";
            f.classList.toggle("bad", !g);
            ok = ok && g;
          });
          if (!ok || !/^\d{6}$/.test(d.pin))
            return toast(
              "Enter all fields and a 6-digit PIN",
              "bi-exclamation-circle-fill",
            );
          p.addresses.push({ id: Date.now(), ...d, def: false });
          sv();
          e.target.reset();
          toast("Address added");
        };
        $("#del").onclick = () => $("#dm").classList.add("show");
        $("#dx").onclick = () => $("#dm").classList.remove("show");
        $("#dy").onclick = () => {
          if ($("#dc").value !== "DELETE")
            return toast(
              "Type DELETE to confirm",
              "bi-exclamation-circle-fill",
            );
          [K.profile, K.orders, K.login].forEach((k) =>
            localStorage.removeItem(k),
          );
          toast("Account deleted");
          setTimeout(() => (location.href = "index.html"), 900);
        };
      },
    );

  /* ---------- Checkout ---------- */
  function checkout() {
    const cart = rd(K.cart, []).filter((i) => i && i.price > 0 && i.qty > 0),
      p = profile(),
      root = $("#co-root");
    if (!cart.length) {
      root.innerHTML = `<div class="container" style="padding:4rem 0"><div class="card empty"><i class="bi bi-bag"></i><h3>Your cart is empty</h3><p style="margin:.5rem 0 1.2rem">Add a few Bhawani favourites to check out.</p><a class="btn-g" href="shop.html">Browse products</a></div></div>`;
      return;
    }
    const a = p.addresses.find((a) => a.def) || p.addresses[0] || {};
    let coupon = null;
    const calc = () => {
      const sub = cart.reduce((s, i) => s + i.price * i.qty, 0),
        rate = sub >= 699 ? 0.15 : sub >= 499 ? 0.1 : 0;
      let disc = Math.round(sub * rate);
      if (coupon === "BHAWANI100") disc += 100;
      const ship = sub >= 199 ? 0 : 49,
        cod =
          $("input[name=pay]:checked")?.value === "COD" && sub < 499 ? 29 : 0;
      return {
        sub,
        disc,
        ship,
        cod,
        tot: Math.max(0, sub - disc + ship + cod),
      };
    };
    root.innerHTML = `<section class="acc-hero"><div class="container" style="text-align:center"><h1>Secure Checkout</h1><p>Almost there — just a few details.</p><div class="co-steps"><span><b>1</b>Cart</span><span class="on"><b>2</b>Details & Payment</span><span><b>3</b>Confirmation</span></div></div></section>
    <div class="container co-wrap"><form id="cf" novalidate><div class="card"><div class="card-h"><h3><i class="bi bi-geo-alt"></i> Delivery details</h3><a href="account-profile.html#addresses">Saved addresses</a></div><div class="fg">
    ${[
      ["name", "Full name", p.name],
      ["phone", "Mobile number", p.phone],
      ["email", "Email", p.email, 1],
      ["line", "Address", a.line || "", 1],
      ["city", "City", a.city || ""],
      ["state", "State", a.state || ""],
      ["pin", "PIN code", a.pin || ""],
    ]
      .map(
        (f) =>
          `<div class="fld ${f[3] ? "full" : ""}"><label>${f[1]}</label><input name="${f[0]}" value="${esc(f[2])}"><div class="err">Please check ${f[1].toLowerCase()}</div></div>`,
      )
      .join("")}</div></div>
    <div class="card"><div class="card-h"><h3><i class="bi bi-credit-card"></i> Payment method</h3></div>
    ${[
      ["UPI", "bi-phone", "UPI", "GPay, PhonePe, Paytm", "Fast"],
      [
        "Card",
        "bi-credit-card-2-front",
        "Credit / Debit card",
        "Visa, Mastercard, RuPay",
      ],
      ["NetBanking", "bi-bank", "Net banking", "All major banks"],
      ["COD", "bi-cash-coin", "Cash on delivery", "₹29 fee under ₹499"],
    ]
      .map(
        (m, i) =>
          `<label class="opt"><input type="radio" name="pay" value="${m[0]}" ${i ? "" : "checked"}><i class="bi ${m[1]}"></i><div><b>${m[2]}</b><small>${m[3]}</small></div>${m[4] ? `<span class="tag">${m[4]}</span>` : ""}</label>`,
      )
      .join("")}
    <div class="fld" id="upi"><label>UPI ID</label><input name="upi" placeholder="name@upi"><div class="err">Enter a valid UPI ID</div></div></div>
    <div class="card"><div class="fld"><label>Order note (optional)</label><textarea name="note" rows="2" placeholder="Delivery instructions…"></textarea></div></div></form>
    <aside class="co-sum"><div class="card sum"><div class="card-h"><h3>Order summary</h3><a href="shop.html">Edit</a></div>${cart.map((i) => `<div class="line"><img src="${esc(i.image || IMG.a)}" alt=""><div class="n">${esc(i.title || i.name)}<small>Qty ${i.qty}</small></div><b>${money(i.price * i.qty)}</b></div>`).join("")}
    <div class="coupon"><input id="cin" placeholder="COUPON CODE"><button class="btn-o" id="cap" type="button">Apply</button></div><div id="sm"></div><button class="btn-g" id="place" style="width:100%;margin-top:1rem" form="cf" type="submit"><i class="bi bi-lock-fill"></i> Place order</button><div class="trust"><span><i class="bi bi-shield-lock"></i> Secure</span><span><i class="bi bi-arrow-repeat"></i> Easy returns</span><span><i class="bi bi-patch-check"></i> Made in India</span></div></div></aside></div>`;
    const draw = () => {
      const t = calc();
      $("#sm").innerHTML =
        `<div><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.disc ? `<div class="save"><span>Discount</span><span>−${money(t.disc)}</span></div>` : ""}<div><span>Shipping</span><span>${t.ship ? money(t.ship) : "Free"}</span></div>${t.cod ? `<div><span>COD fee</span><span>${money(t.cod)}</span></div>` : ""}<div class="tot"><span>Total</span><span>${money(t.tot)}</span></div>`;
      $("#upi").style.display =
        $("input[name=pay]:checked").value === "UPI" ? "" : "none";
    };
    $$("input[name=pay]").forEach((r) => (r.onchange = draw));
    draw();
    $("#cap").onclick = () => {
      const c = $("#cin").value.trim().toUpperCase();
      if (c === "BHAWANI100") {
        coupon = c;
        toast("Coupon applied: ₹100 off");
      } else {
        coupon = null;
        toast("Invalid coupon", "bi-x-circle-fill");
      }
      draw();
    };
    $("#cf").onsubmit = (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      let ok = true;
      const rules = {
        name: (v) => v.trim().length > 2,
        phone: (v) => /^[6-9]\d{9}$/.test(v),
        email: (v) => /^\S+@\S+\.\S+$/.test(v),
        line: (v) => v.trim().length > 4,
        city: (v) => v.trim(),
        state: (v) => v.trim(),
        pin: (v) => /^\d{6}$/.test(v),
        upi: (v) => d.pay !== "UPI" || /^[\w.-]+@\w+$/.test(v),
      };
      $$(".fld", e.target).forEach((f) => {
        const i = $("input", f);
        if (i && rules[i.name]) {
          const g = !!rules[i.name](d[i.name] || "");
          f.classList.toggle("bad", !g);
          ok = ok && g;
        }
      });
      if (!ok) {
        toast(
          "Please fix the highlighted fields",
          "bi-exclamation-circle-fill",
        );
        $(".fld.bad")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const t = calc(),
        id =
          "BHW" + (10500 + orders().length * 7 + Math.floor(Math.random() * 6));
      const o = {
        id,
        date: new Date().toISOString(),
        stage: 0,
        status: "processing",
        pay: d.pay,
        items: cart.map((i) => ({
          title: i.title || i.name,
          price: i.price,
          qty: i.qty,
          image: i.image || IMG.a,
        })),
        shipping: t.ship + t.cod,
        discount: t.disc,
        awb: "BHD" + Math.floor(1e9 + Math.random() * 9e9),
        addr: {
          label: "Delivery",
          line: d.line,
          city: d.city,
          state: d.state,
          pin: d.pin,
        },
      };
      wr(K.orders, [o, ...orders()]);
      wr(K.cart, []);
      wr(K.login, true);
      root.innerHTML = `<div class="container" style="padding:3rem 0 5rem"><div class="card success"><div class="ok"><i class="bi bi-check-lg"></i></div><h1 style="color:#1b4332;font-weight:800">Order placed!</h1><p style="color:#666;margin:.5rem 0 1.5rem">Thank you, ${esc(d.name.split(" ")[0])}. Your order <b>#${id}</b> of <b>${money(t.tot)}</b> is confirmed.<br>A confirmation will be sent to ${esc(d.email)}.</p><div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap"><a class="btn-g" href="account-tracking.html?id=${id}"><i class="bi bi-geo-alt"></i> Track order</a><a class="btn-o" href="account-order-detail.html?id=${id}">View details</a><a class="btn-o" href="shop.html">Continue shopping</a></div></div></div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  const routes = {
    checkout,
    dashboard,
    orders: ordersPg,
    detail,
    tracking,
    profile: profilePg,
  };
  document.addEventListener("DOMContentLoaded", () => routes[page]?.());
})();
