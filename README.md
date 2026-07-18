# SeZaLab Mockup Creator 🎨

Tasarımlarınızı mockup şablonlarına yerleştirmek için Canvas-tabanlı web uygulaması.

## Özellikler

✅ **PNG Tasarım Yükleme** - Kendi tasarımlarınızı yükleyin  
✅ **Mockup Şablonları** - T-Shirt, Hoodie, Tote Bag, Kupa vb.  
✅ **Canvas Editörü** - Pozisyon, boyut, saydamlık, dönüş ayarı  
✅ **Canlı Önizleme** - Değişiklikleri gerçek zamanda görün  
✅ **PNG İndir** - Final mockup'ı PNG olarak indirin  
✅ **Cloudflare R2 Entegrasyonu** - Mockup şablonlarını R2'de saklayın  

## Yapı

```
sezalab-mockup-creator/
├── index.html          # Ana HTML dosyası
├── css/
│   └── styles.css      # CSS stilleri (responsive, dark mode)
├── js/
│   └── app.js          # JavaScript mantığı (class-based)
├── config.json         # R2 URL'leri ve ayarlar
└── README.md           # Bu dosya
```

## Hızlı Başlangıç

### 1. Klonla
```bash
git clone https://github.com/sezalab/mockup-creator.git
cd mockup-creator
```

### 2. R2 URL'lerini Ayarla
`config.json` dosyasını aç ve R2 bucket URL'lerini güncelle:

```json
{
  "mockups": {
    "tshirt-black": "https://your-r2-bucket.r2.dev/mockups/tshirt-black.png",
    "tshirt-white": "https://your-r2-bucket.r2.dev/mockups/tshirt-white.png",
    "hoodie": "https://your-r2-bucket.r2.dev/mockups/hoodie.png",
    "tote": "https://your-r2-bucket.r2.dev/mockups/tote-bag.png",
    "mug": "https://your-r2-bucket.r2.dev/mockups/mug.png"
  }
}
```

### 3. Yerel Server Başlat
```bash
# Python 3.x ile
python -m http.server 8000

# Node.js http-server ile
npx http-server

# Vercel ile
vercel dev
```

Tarayıcıda `http://localhost:8000` açın.

### 4. Kullan
1. **Tasarım Yükle** - PNG dosyasını seç
2. **Mockup Şablonu** - Dropdown'dan ürün türü seç
3. **Ayarla** - Slider'larla pozisyon/boyut/opasite/dönüş ayarla
4. **İndir** - Final mockup'ı PNG olarak indir

## Cloudflare R2 Kurulumu

### 1. Mockup Şablonları Hazırla

Mockup PNG dosyalarını hazırlayın (önerilen boyut: 500x600px):
- `tshirt-black.png`
- `tshirt-white.png`
- `hoodie.png`
- `tote-bag.png`
- `mug.png`

### 2. R2 Bucket Oluştur

```bash
wrangler r2 bucket create sezalab-mockups
```

### 3. Mockup'ları Yükle

```bash
# Tek dosya
wrangler r2 object put sezalab-mockups mockups/tshirt-black.png --file tshirt-black.png

# Ya da AWS CLI ile
aws s3 cp mockups/ s3://sezalab-mockups/mockups/ --recursive \
  --endpoint-url https://r2.example.com
```

### 4. Public URL Al

R2 Settings → Custom domain veya Public URL'sini al:
```
https://sezalab-mockups.r2.dev
```

### 5. config.json Güncelle

```json
{
  "mockups": {
    "tshirt-black": "https://sezalab-mockups.r2.dev/mockups/tshirt-black.png",
    ...
  }
}
```

## API / Config

### config.json Seçenekleri

```json
{
  "app": {
    "name": "SeZaLab Mockup Creator",
    "version": "1.0.0"
  },
  "mockups": {
    "template-key": "https://r2-url/mockup.png"
  },
  "canvas": {
    "defaultWidth": 500,
    "defaultHeight": 600,
    "minWidth": 300,
    "minHeight": 400
  },
  "design": {
    "minOpacity": 0,
    "maxOpacity": 100,
    "minSize": 50,
    "maxSize": 600,
    "supportedFormats": ["image/png"]
  }
}
```

## JavaScript API

Programlı kullanım:

```javascript
// App objesine erişin
window.mockupCreator

// Tasarım yükle
window.mockupCreator.state.designImage

// Şablon değiştir
document.getElementById('templateSelect').value = 'tshirt-black';
window.mockupCreator.handleTemplateChange({ target: { value: 'tshirt-black' } });

// Canvas'ı güncelle
window.mockupCreator.updateCanvas();

// İndir
window.mockupCreator.downloadMockup();
```

## Styling

### CSS Değişkenleri

```css
:root {
  --primary-color: #2563eb;
  --border-color: #e5e7eb;
  --bg-light: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

Dark mode otomatik olarak etkinleşir.

### Özelleştirme

CSS dosyasını değiştirerek renkleri ve stil özelleştir:
- Renkler: `--primary-color`, `--border-color` vb.
- Tipografi: Font ailesi, boyut
- Layout: Container genişliği, padding

## Tarayıcı Desteği

- Chrome/Edge: ✅ Tam destek
- Firefox: ✅ Tam destek
- Safari: ✅ Tam destek
- Mobile: ✅ Responsive tasarım

## Üretim Dağıtımı

### Vercel

```bash
# Vercel CLI kuruluyla
npm i -g vercel
vercel

# Ya da GitHub Actions ile
git push
# Vercel otomatik deploy eder
```

### GitHub Pages

```bash
# Repo settings'inde Pages seç
# Source: main branch / root

# Veya:
git push
# https://username.github.io/mockup-creator/
```

### Netlify

```bash
# Netlify CLI ile
npm i -g netlify-cli
netlify deploy --prod --dir .

# Drag & Drop
# Site settings > Build & deploy
```

## Sorun Giderme

### Config yüklenmiyor
- `config.json` dosyasının doğru yolda olup olmadığını kontrol edin
- Browser console'da hata mesajını kontrol edin

### R2 URL'si çalışmıyor
- URL'nin erişilebilir olup olmadığını kontrol edin
- CORS ayarlarını kontrol edin:
  ```json
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
  ```

### Mockup yüklenmiyorsa
- Şablon PNG dosyası var mı?
- Dosya boyutu yeterli mi?
- Console'da CORS hataları var mı?

## Geliştirme

### Proje Yapısı

```
index.html   - UI (HTML5)
├── css/styles.css   - Styling (CSS3, Responsive, Dark Mode)
├── js/app.js        - Logic (ES6 Class-based)
└── config.json      - Configuration
```

### Yeni Özellik Ekleme

1. `js/app.js` içinde `MockupCreator` class'ına metod ekle
2. `index.html`'ye HTML elementi ekle
3. `css/styles.css`'ye stil ekle
4. Event listener ekle `init()` içinde

Örnek:
```javascript
// js/app.js
addFeature() {
  console.log('Yeni özellik çalışıyor');
}

// init() içine:
document.getElementById('featureBtn').addEventListener('click', () => this.addFeature());
```

### Testing

```bash
# Yerel test
python -m http.server 8000
# http://localhost:8000

# İndir ve açılış testleri yap
# Canvas rendering ve CORS kontrol et
```

## Lisans

MIT

## İletişim

- GitHub: [@sezalab](https://github.com/sezalab)
- Email: info@sezalab.com

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 2024
