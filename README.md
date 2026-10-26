# Bir Dilek Tut 🎂

Mumları üfleyerek doğum günü mesajını açabileceğin, sevdiklerin için kişisel hediye linkleri hazırlayabileceğin küçük bir web sitesi.

Koyu arka plan, hareketli mumlar, iki yandan patlayan konfetiler ve zarftan çıkan kişisel bir not. Mobil ve masaüstüne uyumludur; dikey 9:16 ekranlar için düzenlenmiştir.

## Nasıl kullanılır?

1. Siteyi aç ve **Hediye hazırla** butonuna dokun.
2. İstersen doğum günü sahibinin adını yaz. İsim alanını boş da bırakabilirsin.
3. Mesajını ve kimden geldiğini yaz.
4. **Hediye linkini oluştur** butonuna dokun, linki kopyalayıp gönder.
5. Linki alan kişi **Mumları üflemek için buraya dokun** butonuna basar, mikrofon iznini verir ve kısa bir sessizlikten sonra ekrana doğru üfler.
6. Mumlar söner, konfetiler patlar ve kişisel mesaj zarfın içinden çıkar.

Mikrofon kullanmak istemeyenler **Pastaya dokun** seçeneğiyle mesajı açabilir.

## GitHub Pages ile yayınlama

Şu dört dosyayı reponun ana klasörüne yükle:

- `index.html`
- `style.css`
- `app.js`
- `cake.png`

Bu `README.md` dosyasını da açıklama olarak ekleyebilirsin. Kurulum veya derleme gerekmez.

GitHub reposunda **Settings → Pages** yolunu izle. **Deploy from a branch**, `main` ve `/ (root)` seçeneklerini seçip kaydet. Yayın tamamlandığında GitHub'ın verdiği HTTPS adresini aç.

**Paylaşacağın kişisel hediye linklerini yayınlanan site üzerinden oluştur.** Bilgisayarındaki `localhost` veya `127.0.0.1` linkleri başka cihazlarda çalışmaz.

## Mikrofon ve mesajlar

- Mikrofon HTTPS veya localhost üzerinde çalışır. Instagram gibi uygulamaların dahili tarayıcılarında sorun yaşarsan linki telefonunun normal tarayıcısında açabilir veya pastaya dokunabilirsin.
- Ses kaydedilmez veya sunucuya gönderilmez. Üfleme cihaz üzerinde ses seviyesiyle algılanır; yüksek ortam sesi de mumları söndürebilir.
- İsim, mesaj ve imza linkin içinde kodlanarak saklanır. Uygun tarayıcılarda, boyutu küçültüyorsa sıkıştırılır. Bu işlem şifreleme değildir; linki alan herkes mesajı açabilir.
- Uzun mesajlarda sayfanın tamamı yerine mesaj kâğıdının içi kaydırılır.
- Yazı tipleri Google Fonts üzerinden yüklenir; yüklenemezse sistem yazı tipleri kullanılır.

## Yerel önizleme

Dosyaların bulunduğu klasörde şu komutu çalıştır:

```sh
python -m http.server 4173
```

Ardından tarayıcıda `http://localhost:4173` adresini aç.

## İletişim

Instagram: [@muh.elifcaliskaner](https://www.instagram.com/muh.elifcaliskaner/)
