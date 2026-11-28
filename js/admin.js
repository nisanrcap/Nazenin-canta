/* Nazenin - Yönetim paneli (sunucusuz, localStorage tabanlı)
   Bu dosya hem giriş sayfasında hem panel sayfalarında çalışır.
   Gerekli: js/urunler.js (veri + yardımcılar) admin/urunler.html'de bundan önce yüklenmeli. */
(function () {
  var OTURUM = 'nazeninAdmin';

  function girisVar() { try { return sessionStorage.getItem(OTURUM) === '1'; } catch (e) { return false; } }

  /* ---------- GİRİŞ SAYFASI ---------- */
  var lf = document.getElementById('loginForm');
  if (lf) {
    if (girisVar()) { window.location.replace('urunler.html'); return; }
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('u').value === 'admin' &&
               document.getElementById('p').value === 'nazenin2026';
      if (ok) {
        try { sessionStorage.setItem(OTURUM, '1'); } catch (x) {}
        window.location.href = 'urunler.html';
      } else {
        document.getElementById('loginErr').style.display = 'block';
      }
    });
    return;
  }

  /* ---------- PANEL SAYFALARI: oturum yoksa girişe gönder ---------- */
  if (!girisVar()) { window.location.replace('giris.html'); return; }

  var sayfa = document.body.getAttribute('data-admin');

  function bildir(metin) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = metin; t.style.display = 'block';
    clearTimeout(bildir._z); bildir._z = setTimeout(function () { t.style.display = 'none'; }, 2600);
  }

  /* ---------- SOL MENÜ ---------- */
  var yan = document.getElementById('adm-side');
  if (yan) {
    yan.className = 'adm-side';
    function aktif(k) { return sayfa === k ? ' class="active"' : ''; }
    yan.innerHTML =
      '<a class="logo" href="../index.html">Nazenin.</a><small>Yönetim paneli</small>' +
      '<nav aria-label="Yönetim menüsü">' +
        '<a href="urunler.html"' + aktif('products') + '><i class="fa fa-shopping-bag" aria-hidden="true"></i> Ürünler</a>' +
        '<a href="duyurular.html"' + aktif('announcements') + '><i class="fa fa-bullhorn" aria-hidden="true"></i> Duyurular</a>' +
      '</nav>' +
      '<div class="bottom">' +
        '<a class="btn ghost sm" href="../index.html" style="color:#e8dacb;border-color:#e8dacb;margin-bottom:8px;display:flex;justify-content:center">Siteyi gör</a>' +
        '<button type="button" class="btn sm" id="btnCikis" style="width:100%;justify-content:center">Çıkış yap</button>' +
      '</div>';
    document.getElementById('btnCikis').addEventListener('click', function () {
      try { sessionStorage.removeItem(OTURUM); } catch (e) {}
      window.location.href = 'giris.html';
    });
  }

  /* ---------- ÜRÜN YÖNETİMİ ---------- */
  if (sayfa === 'products') urunPaneli();
  if (sayfa === 'announcements') duyuruPaneli();


  /* ---------- DUYURU YÖNETİMİ ---------- */
  function duyuruPaneli() {
    var liste = duyurulariYukle();
    var satirlar = document.getElementById('annRows');
    var form = document.getElementById('annForm');
    var resimDosya = document.getElementById('aImgFile');
    var onizleme = document.getElementById('aImgPrev');
    var ekDosya = document.getElementById('aFiles');
    var ekListe = document.getElementById('aFileList');
    var duzenlenen = null, yeniResim = '', ekler = [];

    var MAX_EK = 1.5 * 1024 * 1024; // tarayici deposu kucuk: ek basina 1,5 MB

    function kaydet() {
      try { duyurulariKaydet(liste); return true; }
      catch (e) { bildir('Depolama dolu: ekleri küçültün veya bazı duyuruları silin.'); return false; }
    }

    function ciz() {
      satirlar.innerHTML = duyurulariSirala(liste).map(function (d) {
        return '<tr>' +
          '<td><img src="' + kacis(gosterYol(d.resim || '')) + '" alt=""></td>' +
          '<td><strong>' + kacis(d.baslik) + '</strong></td>' +
          '<td>' + kacis(trTarih(d.tarih)) + '</td>' +
          '<td>' + ((d.ekler || []).length || '—') + '</td>' +
          '<td><button type="button" class="btn ghost sm" data-duzenle="' + kacis(d.id) + '">Düzenle</button> ' +
              '<button type="button" class="btn danger sm" data-sil="' + kacis(d.id) + '">Sil</button></td>' +
          '</tr>';
      }).join('') || '<tr><td colspan="5">Henüz duyuru yok. Aşağıdaki formdan ekleyin.</td></tr>';
    }

    function ekleriCiz() {
      ekListe.innerHTML = ekler.map(function (e, i) {
        return '<span>' + kacis(e.ad) + '<button type="button" data-ek-sil="' + i + '" aria-label="' + kacis(e.ad) + ' dosyasını kaldır">&times;</button></span>';
      }).join('');
    }

    function formuSifirla() {
      duzenlenen = null; yeniResim = ''; ekler = [];
      form.reset();
      document.getElementById('aDate').value = new Date().toISOString().slice(0, 10);
      onizleme.style.display = 'none'; onizleme.removeAttribute('src');
      ekleriCiz();
      document.getElementById('annFormTitle').textContent = 'Yeni duyuru ekle';
      document.getElementById('annCancel').style.display = 'none';
    }

    function kucult(f, cb) {
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 1000, w = img.width, h = img.height;
          if (w > max) { h = Math.round(h * max / w); w = max; }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          cb(c.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = function () { cb(null); };
        img.src = r.result;
      };
      r.onerror = function () { cb(null); };
      r.readAsDataURL(f);
    }

    resimDosya.addEventListener('change', function () {
      yeniResim = '';
      var f = resimDosya.files[0];
      if (!f) { onizleme.style.display = 'none'; return; }
      kucult(f, function (d) {
        if (!d) { bildir('Resim okunamadı, başka bir dosya deneyin.'); return; }
        yeniResim = d; onizleme.src = d; onizleme.style.display = 'block';
      });
    });

    // PDF / Word / resim ekleri: dosya adı ve içerik (dataURL) saklanır
    ekDosya.addEventListener('change', function () {
      Array.prototype.slice.call(ekDosya.files).forEach(function (f) {
        if (f.size > MAX_EK) { bildir('"' + f.name + '" çok büyük (en fazla 1,5 MB).'); return; }
        var r = new FileReader();
        r.onload = function () { ekler.push({ ad: f.name, url: r.result }); ekleriCiz(); };
        r.readAsDataURL(f);
      });
      ekDosya.value = '';
    });

    ekListe.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ek-sil]');
      if (!b) return;
      ekler.splice(parseInt(b.getAttribute('data-ek-sil'), 10), 1);
      ekleriCiz();
    });

    satirlar.addEventListener('click', function (e) {
      var d = e.target.closest('[data-duzenle]'), s = e.target.closest('[data-sil]');
      if (d) {
        var x = liste.filter(function (k) { return k.id === d.getAttribute('data-duzenle'); })[0];
        if (!x) return;
        duzenlenen = x.id; yeniResim = ''; ekler = (x.ekler || []).slice();
        document.getElementById('aTitle').value = x.baslik;
        document.getElementById('aDate').value = x.tarih;
        document.getElementById('aText').value = x.metin;
        document.getElementById('aImgPath').value = /^data:/.test(x.resim || '') ? '' : (x.resim || '');
        onizleme.src = gosterYol(x.resim || ''); onizleme.style.display = 'block';
        ekleriCiz();
        document.getElementById('annFormTitle').textContent = 'Duyuruyu düzenle';
        document.getElementById('annCancel').style.display = 'inline-flex';
        form.scrollIntoView({ behavior: 'smooth' });
      }
      if (s) {
        var id = s.getAttribute('data-sil');
        var y = liste.filter(function (k) { return k.id === id; })[0];
        if (y && confirm('"' + y.baslik + '" silinsin mi?')) {
          liste = liste.filter(function (k) { return k.id !== id; });
          if (kaydet()) { ciz(); bildir('Duyuru silindi.'); }
        }
      }
    });

    document.getElementById('annCancel').addEventListener('click', formuSifirla);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mevcut = duzenlenen ? liste.filter(function (k) { return k.id === duzenlenen; })[0] : null;
      var yol = document.getElementById('aImgPath').value.trim();
      var resim = yeniResim || yol || (mevcut ? mevcut.resim : '');
      if (!resim) { bildir('Lütfen bir resim yükleyin veya resim yolu yazın.'); return; }
      var veri = {
        baslik: document.getElementById('aTitle').value.trim(),
        tarih: document.getElementById('aDate').value,
        metin: document.getElementById('aText').value.trim(),
        resim: resim,
        ekler: ekler.slice()
      };
      if (mevcut) { Object.keys(veri).forEach(function (k) { mevcut[k] = veri[k]; }); }
      else { veri.id = 'd' + Date.now().toString(36); liste.push(veri); }
      if (kaydet()) { ciz(); formuSifirla(); bildir('Duyuru kaydedildi.'); }
    });

    var baslik = document.querySelector('.adm-head');
    if (baslik) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ghost sm'; b.textContent = 'Örnek duyurulara dön';
      b.addEventListener('click', function () {
        if (confirm('Yaptığınız tüm duyuru değişiklikleri silinip örnek duyurular geri yüklensin mi?')) {
          duyurulariSifirla(); liste = duyurulariYukle(); ciz(); formuSifirla(); bildir('Örnek duyurular geri yüklendi.');
        }
      });
      baslik.appendChild(b);
    }

    formuSifirla();
    ciz();
  }

  function gosterYol(y) { return /^(data:|https?:|\/)/.test(y) ? y : '../' + y; } // admin/ içinden doğru görsel yolu

  function urunPaneli() {
    var liste = urunleriYukle();
    var satirlar = document.getElementById('prodRows');
    var form = document.getElementById('prodForm');
    var secKat = document.getElementById('fCat');
    var dosya = document.getElementById('fImgFile');
    var onizleme = document.getElementById('fImgPrev');
    var duzenlenen = null;       // düzenlenen ürünün id'si (yoksa yeni ürün)
    var yeniGorseller = [];      // yüklenip küçültülmüş görseller (dataURL)

    Object.keys(KATEGORILER).forEach(function (k) {
      var o = document.createElement('option'); o.value = k; o.textContent = KATEGORILER[k].ad; secKat.appendChild(o);
    });

    function kaydet() {
      try { urunleriKaydet(liste); return true; }
      catch (e) { bildir('Depolama dolu: görselleri küçült veya bazı ürünleri sil.'); return false; }
    }

    function ciz() {
      satirlar.innerHTML = liste.map(function (u) {
        var adet = (typeof u.stokAdet === 'number') ? u.stokAdet : (u.stok ? '—' : 0);
        return '<tr>' +
          '<td><img src="' + kacis(gosterYol(u.gorseller[0] || '')) + '" alt=""></td>' +
          '<td><strong>' + kacis(u.ad) + '</strong><br><span class="tag">' + kacis(KATEGORILER[u.kategori] ? KATEGORILER[u.kategori].tekil : u.kategori) + '</span></td>' +
          '<td>' + trFiyat(Number(u.fiyat)) + '</td>' +
          '<td>' + (adet === 0 ? '<span class="tag new">Tükendi</span>' : kacis(adet)) + '</td>' +
          '<td><button type="button" class="btn ghost sm" data-duzenle="' + kacis(u.id) + '">Düzenle</button> ' +
              '<button type="button" class="btn danger sm" data-sil="' + kacis(u.id) + '">Sil</button></td>' +
          '</tr>';
      }).join('') || '<tr><td colspan="5">Henüz ürün yok. Aşağıdaki formdan ekleyin.</td></tr>';
    }

    function formuSifirla() {
      duzenlenen = null; yeniGorseller = [];
      form.reset();
      document.getElementById('fStock').value = 10;
      document.getElementById('fRating').value = 5;
      onizleme.style.display = 'none'; onizleme.removeAttribute('src');
      document.getElementById('formTitle').textContent = 'Yeni ürün ekle';
      document.getElementById('btnCancel').style.display = 'none';
    }

    // Görseli küçültüp JPEG'e çevirir (localStorage kotasını aşmamak için)
    function kucult(f, cb) {
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 1000, w = img.width, h = img.height;
          if (w > max) { h = Math.round(h * max / w); w = max; }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          cb(c.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = function () { cb(null); };
        img.src = r.result;
      };
      r.onerror = function () { cb(null); };
      r.readAsDataURL(f);
    }

    dosya.addEventListener('change', function () {
      yeniGorseller = [];
      var dosyalar = Array.prototype.slice.call(dosya.files, 0, 3);
      if (!dosyalar.length) { onizleme.style.display = 'none'; return; }
      var bekleyen = dosyalar.length, sonuc = [];
      dosyalar.forEach(function (f, i) {
        kucult(f, function (d) {
          sonuc[i] = d;
          if (--bekleyen === 0) {
            yeniGorseller = sonuc.filter(Boolean);
            if (yeniGorseller.length) { onizleme.src = yeniGorseller[0]; onizleme.style.display = 'block'; }
            else bildir('Görsel okunamadı, başka bir dosya deneyin.');
          }
        });
      });
    });

    satirlar.addEventListener('click', function (e) {
      var d = e.target.closest('[data-duzenle]'), s = e.target.closest('[data-sil]');
      if (d) {
        var u = liste.filter(function (x) { return x.id === d.getAttribute('data-duzenle'); })[0];
        if (!u) return;
        duzenlenen = u.id; yeniGorseller = [];
        document.getElementById('fName').value = u.ad;
        secKat.value = u.kategori;
        document.getElementById('fPrice').value = u.fiyat;
        document.getElementById('fStock').value = (typeof u.stokAdet === 'number') ? u.stokAdet : (u.stok ? 10 : 0);
        document.getElementById('fRating').value = u.yildiz || 5;
        document.getElementById('fDesc').value = u.aciklama;
        document.getElementById('fFeat').value = (u.ozellikler || []).join('\n');
        document.getElementById('fImgPath').value = /^data:/.test(u.gorseller[0] || '') ? '' : (u.gorseller[0] || '');
        onizleme.src = gosterYol(u.gorseller[0] || ''); onizleme.style.display = 'block';
        document.getElementById('formTitle').textContent = 'Ürünü düzenle: ' + u.ad;
        document.getElementById('btnCancel').style.display = 'inline-flex';
        form.scrollIntoView({ behavior: 'smooth' });
      }
      if (s) {
        var id = s.getAttribute('data-sil');
        var ur = liste.filter(function (x) { return x.id === id; })[0];
        if (ur && confirm('"' + ur.ad + '" silinsin mi?')) {
          liste = liste.filter(function (x) { return x.id !== id; });
          if (kaydet()) { ciz(); bildir('Ürün silindi.'); }
        }
      }
    });

    document.getElementById('btnCancel').addEventListener('click', formuSifirla);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mevcut = duzenlenen ? liste.filter(function (x) { return x.id === duzenlenen; })[0] : null;
      var yol = document.getElementById('fImgPath').value.trim();
      var gorseller = yeniGorseller.length ? yeniGorseller : (yol ? [yol] : (mevcut ? mevcut.gorseller : []));
      if (!gorseller.length) { bildir('Lütfen bir görsel yükleyin veya görsel yolu yazın.'); return; }

      var adet = parseInt(document.getElementById('fStock').value, 10) || 0;
      var ozellikler = document.getElementById('fFeat').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      var ad = document.getElementById('fName').value.trim();

      var veri = {
        ad: ad,
        kategori: secKat.value,
        fiyat: parseFloat(document.getElementById('fPrice').value),
        yildiz: Math.min(5, Math.max(1, parseInt(document.getElementById('fRating').value, 10) || 5)),
        stokAdet: adet,
        stok: adet > 0,
        aciklama: document.getElementById('fDesc').value.trim(),
        ozellikler: ozellikler,
        gorseller: gorseller
      };

      if (mevcut) {
        Object.keys(veri).forEach(function (k) { mevcut[k] = veri[k]; });
      } else {
        veri.id = 'u' + Date.now().toString(36);
        veri.yorumlar = [];
        liste.push(veri);
      }
      if (kaydet()) { ciz(); formuSifirla(); bildir('Ürün kaydedildi.'); }
    });

    // Varsayılan ürünlere dön (demo sırasında işe yarar)
    var baslik = document.querySelector('.adm-head');
    if (baslik) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ghost sm'; b.textContent = 'Örnek ürünlere dön';
      b.addEventListener('click', function () {
        if (confirm('Yaptığınız tüm ürün değişiklikleri silinip örnek ürünler geri yüklensin mi?')) {
          urunleriSifirla(); liste = urunleriYukle(); ciz(); formuSifirla(); bildir('Örnek ürünler geri yüklendi.');
        }
      });
      baslik.appendChild(b);
    }

    ciz();
  }
})();
