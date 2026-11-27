/* ==========================================================
   js/layout.js  -  Header ve footer'in TEK TANIM yeri
   Her sayfada <div id="site-header"></div> ve <div id="site-footer"></div>
   yer tutucuları vardır; bu dosya onların yerine asıl HTML'i koyar.
   Menüyü ya da footer'ı değiştirmek için sadece bu dosyayı düzenle.
   ÖNEMLİ: Sayfada custom.js'ten ÖNCE yüklenmeli (menü düğmesi, header
   küçülmesi gibi Wish kodları header HTML'i sayfada hazır olunca çalışır).
   ========================================================== */
(function () {
	'use strict';
	var yil = new Date().getFullYear();

	var HEADER = `
	<!-- Header -->

	<header class="header">
		<div class="header_inner d-flex flex-row align-items-center justify-content-start">
			<div class="logo"><a href="index.html">Nazenin</a></div>
			<nav class="main_nav" aria-label="Ana menü">
				<ul>
					<li><a href="index.html">Ana Sayfa</a></li>
					<li class="has-sub">
						<a href="urunler.html">Ürünlerimiz</a>
						<ul class="submenu">
							<li><a href="urun_omuz.html">Omuz Çantası</a></li>
							<li><a href="urun_el.html">El Çantası</a></li>
							<li><a href="urun_sirt.html">Sırt Çantası</a></li>
							<li><a href="urun_cuzdan.html">Cüzdan</a></li>
						</ul>
					</li>
					<li><a href="duyurular.html">Duyurular</a></li>
					<li><a href="hakkimizda.html">Hakkımızda</a></li>
					<li><a href="misyon-vizyon.html">Misyon-Vizyon</a></li>
					<li><a href="rakamlarla-nazenin.html">Rakamlarla Nazenin</a></li>
					<li><a href="iletisim.html">İletişim</a></li>
				</ul>
			</nav>
			<div class="header_content ml-auto">
				<div class="shopping">
					<!-- Sepetim -->
					<a href="sepet.html" aria-label="Sepetim">
						<div class="cart">
							<img src="images/shopping-bag.svg" alt="">
						</div>
					</a>
					<!-- Yönetici girişi -->
					<a href="admin/giris.html" aria-label="Yönetici girişi">
						<div class="avatar">
							<img src="images/avatar.svg" alt="">
						</div>
					</a>
				</div>
			</div>

			<!-- Mobil menü düğmesi: SİLME, 991px altında menü sadece bununla açılır -->
			<div class="burger_container d-flex flex-column align-items-center justify-content-around menu_mm" role="button" aria-label="Menüyü aç"><div></div><div></div><div></div></div>
		</div>
	</header>

	<!-- Mobil menü paneli: SİLME, aynı menü bağlantıları burada da olmalı -->

	<div class="menu d-flex flex-column align-items-end justify-content-start text-right menu_mm trans_400">
		<div class="menu_close_container"><div class="menu_close"><div></div><div></div></div></div>
		<div class="logo menu_mm"><a href="index.html">Nazenin</a></div>
		<nav class="menu_nav" aria-label="Mobil menü">
			<ul class="menu_mm">
				<li class="menu_mm"><a href="index.html">Ana Sayfa</a></li>
				<li class="menu_mm"><a href="urunler.html">Ürünlerimiz</a>
					<ul class="menu_mm">
						<li class="menu_mm"><a href="urun_omuz.html">Omuz Çantası</a></li>
						<li class="menu_mm"><a href="urun_el.html">El Çantası</a></li>
						<li class="menu_mm"><a href="urun_sirt.html">Sırt Çantası</a></li>
						<li class="menu_mm"><a href="urun_cuzdan.html">Cüzdan</a></li>
					</ul>
				</li>
				<li class="menu_mm"><a href="duyurular.html">Duyurular</a></li>
				<li class="menu_mm"><a href="hakkimizda.html">Hakkımızda</a></li>
				<li class="menu_mm"><a href="misyon-vizyon.html">Misyon-Vizyon</a></li>
				<li class="menu_mm"><a href="rakamlarla-nazenin.html">Rakamlarla Nazenin</a></li>
				<li class="menu_mm"><a href="iletisim.html">İletişim</a></li>
			</ul>
		</nav>
	</div>
`;

	var FOOTER = `
	<!-- Footer -->

	<footer class="footer">
		<div class="container">
			<div class="row">

				<!-- 1. Sütun: logo, kısa tanıtım, sosyal medya -->
				<div class="col-lg-5 footer_col">
					<div class="footer_logo"><a href="index.html">Nazenin</a></div>
					<p class="footer_about">Nazenin, Gebze'deki atölyesinde omuz, el ve sırt çantaları ile clutch modelleri tasarlayıp el emeğiyle üretir. Günlük hayatın içinde uzun yıllar yanınızda kalacak çantalar sunuyoruz.</p>
					<div class="footer_social">
						<ul>
							<li><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
							<li><a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
							<li><a href="https://x.com/" target="_blank" rel="noopener" aria-label="X (Twitter)"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
							<li><a href="https://www.pinterest.com/" target="_blank" rel="noopener" aria-label="Pinterest"><i class="fa fa-pinterest-p" aria-hidden="true"></i></a></li>
						</ul>
					</div>
				</div>

				<!-- 2. Sütun: sayfa bağlantıları (Birimlerimiz yok) -->
				<div class="col-sm-6 col-lg-3 footer_col">
					<h3 class="footer_title">Sayfalar</h3>
					<nav class="footer_nav" aria-label="Alt menü">
						<ul>
							<li><a href="index.html">Ana Sayfa</a></li>
							<li><a href="urunler.html">Ürünlerimiz</a></li>
							<li><a href="duyurular.html">Duyurular</a></li>
							<li><a href="hakkimizda.html">Hakkımızda</a></li>
							<li><a href="misyon-vizyon.html">Misyon-Vizyon</a></li>
							<li><a href="rakamlarla-nazenin.html">Rakamlarla Nazenin</a></li>
							<li><a href="iletisim.html">İletişim</a></li>
						</ul>
					</nav>
				</div>

				<!-- 3. Sütun: adres, telefon, e-posta, çalışma saatleri -->
				<div class="col-sm-6 col-lg-4 footer_col">
					<h3 class="footer_title">İletişim</h3>
					<ul class="footer_contact">
						<li><i class="fa fa-map-marker" aria-hidden="true"></i><span>Gebze / Kocaeli</span></li>
						<li><i class="fa fa-phone" aria-hidden="true"></i><a href="tel:+902620000000">+90 000 000 00 00</a></li>
						<li><i class="fa fa-envelope-o" aria-hidden="true"></i><a href="mailto:info@nazenincanta.com">info@nazenincanta.com</a></li>
						<li><i class="fa fa-clock-o" aria-hidden="true"></i><span>Hafta içi 09.00–18.00</span></li>
					</ul>
				</div>
			</div>

			<!-- Alt şerit: tasarımcı bilgisi + telif -->
			<div class="footer_bottom">
				<p class="footer_designer">Web sitesi tasarımı: <strong>Nisanur ÇAP – 241307061</strong> · Kocaeli Üniversitesi, Bilişim Sistemleri Mühendisliği Web Tasarımı</p>
				<div class="copyright"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
&copy;${yil} Nazenin Çanta. Tüm hakları saklıdır. | Şablon: Wish, <a href="https://colorlib.com" target="_blank" rel="noopener">Colorlib</a> (CC BY 3.0). Bu site bir ders projesidir, ürünler ve marka kurgusaldır.
<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --></div>
			</div>
		</div>
	</footer>
`;

	function yerlestir(id, html) {
		var el = document.getElementById(id);
		if (el) { el.outerHTML = html; }
	}
	yerlestir('site-header', HEADER);
	yerlestir('site-footer', FOOTER);

	/* Bulunulan sayfayı menüde işaretle (aktif sayfa) */
	var dosya = window.location.pathname.split('/').pop() || 'index.html';
	var bagli = document.querySelectorAll('.main_nav > ul > li > a, .menu_nav > ul > li > a');
	for (var i = 0; i < bagli.length; i++) {
		if (bagli[i].getAttribute('href').split('?')[0] === dosya) {
			bagli[i].classList.add('active');
			bagli[i].setAttribute('aria-current', 'page');
		}
	}
})();
