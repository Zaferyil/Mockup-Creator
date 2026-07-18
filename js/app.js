// SeZaLab Mockup Creator - Application Logic

class MockupCreator {
  constructor() {
    this.canvas = document.getElementById('mockupCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.state = {
      designImage: null,
      mockupImage: null,
      selectedTemplate: null,
      canvasWidth: 500,
      canvasHeight: 600,
      
      // Tasarım pozisyonu
      posX: 100,
      posY: 150,
      designWidth: 200,
      designHeight: 200,
      opacity: 100,
      rotation: 0
    };

    // Mockup şablonları (R2 URL'leri config.json'dan yüklenir)
    this.mockupTemplates = {
      'tshirt-black': { name: 'T-Shirt Siyah', width: 500, height: 600, url: null },
      'tshirt-white': { name: 'T-Shirt Beyaz', width: 500, height: 600, url: null },
      'hoodie': { name: 'Hoodie', width: 500, height: 600, url: null },
      'tote': { name: 'Tote Bag', width: 500, height: 600, url: null },
      'mug': { name: 'Kupa', width: 500, height: 600, url: null }
    };

    this.init();
  }

  init() {
    // Event Listeners
    document.getElementById('designInput').addEventListener('change', (e) => this.handleDesignUpload(e));
    document.getElementById('templateSelect').addEventListener('change', (e) => this.handleTemplateChange(e));
    document.getElementById('downloadBtn').addEventListener('click', () => this.downloadMockup());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetDesign());

    // Slider listeners
    ['posX', 'posY', 'designWidth', 'designHeight', 'opacity', 'rotation'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.updateCanvas());
    });

    // Config yükle
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const response = await fetch('config.json');
      const config = await response.json();
      
      // R2 URL'lerini şablonlara aktar
      Object.keys(config.mockups).forEach(key => {
        if (this.mockupTemplates[key]) {
          this.mockupTemplates[key].url = config.mockups[key];
        }
      });

      this.log('Config yüklendi', 'success');
    } catch (error) {
      this.log('Config yüklenemedi: ' + error.message, 'error');
    }
  }

  handleDesignUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.state.designImage = img;
        document.getElementById('positioningControls').classList.remove('controls-hidden');
        this.updateCanvas();
        this.log(`Tasarım yüklendi: ${file.name}`, 'success');
      };
      img.onerror = () => {
        this.log('Görüntü yüklenemedi', 'error');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  handleTemplateChange(e) {
    const templateKey = e.target.value;
    
    if (!templateKey) {
      this.state.selectedTemplate = null;
      this.state.mockupImage = null;
      this.updateCanvas();
      document.getElementById('downloadBtn').disabled = true;
      return;
    }

    const template = this.mockupTemplates[templateKey];
    
    if (!template.url) {
      this.log('Şablon URL\'si bulunamadı. Config.json kontrol edin', 'error');
      return;
    }

    this.state.selectedTemplate = templateKey;
    
    const mockupImg = new Image();
    mockupImg.onload = () => {
      this.state.mockupImage = mockupImg;
      this.canvas.width = template.width;
      this.canvas.height = template.height;
      this.state.canvasWidth = template.width;
      this.state.canvasHeight = template.height;
      this.updateCanvas();
      document.getElementById('downloadBtn').disabled = false;
      this.log(`Şablon yüklendi: ${template.name}`, 'success');
    };
    
    mockupImg.onerror = () => {
      this.log(`Şablon yüklenemedi: ${template.url}`, 'error');
    };
    
    mockupImg.src = template.url;

    // Preview info
    const previewInfo = document.getElementById('previewInfo');
    document.getElementById('previewText').textContent = `Şablon: ${template.name}`;
    previewInfo.classList.remove('info-hidden');
  }

  updateCanvas() {
    // Canvas temizle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Mockup çiz
    if (this.state.mockupImage) {
      this.ctx.drawImage(
        this.state.mockupImage,
        0, 0,
        this.canvas.width,
        this.canvas.height
      );
    } else {
      // Placeholder
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#999';
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Mockup şablonu seçin', this.canvas.width / 2, this.canvas.height / 2);
    }

    // Tasarımı çiz
    if (this.state.designImage) {
      const posX = parseInt(document.getElementById('posX').value);
      const posY = parseInt(document.getElementById('posY').value);
      const width = parseInt(document.getElementById('designWidth').value);
      const height = parseInt(document.getElementById('designHeight').value);
      const opacity = parseInt(document.getElementById('opacity').value) / 100;
      const rotation = parseInt(document.getElementById('rotation').value);

      // State güncelle
      this.state.posX = posX;
      this.state.posY = posY;
      this.state.designWidth = width;
      this.state.designHeight = height;
      this.state.opacity = opacity * 100;
      this.state.rotation = rotation;

      this.ctx.save();
      
      // Dönüş uygula
      if (rotation !== 0) {
        this.ctx.translate(posX + width / 2, posY + height / 2);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.translate(-(posX + width / 2), -(posY + height / 2));
      }

      this.ctx.globalAlpha = opacity;
      this.ctx.drawImage(
        this.state.designImage,
        posX, posY,
        width, height
      );
      
      this.ctx.restore();

      // Değer göstergelerini güncelle
      this.updateValueDisplays();
    }
  }

  updateValueDisplays() {
    document.getElementById('posXValue').textContent = this.state.posX;
    document.getElementById('posYValue').textContent = this.state.posY;
    document.getElementById('widthValue').textContent = this.state.designWidth;
    document.getElementById('heightValue').textContent = this.state.designHeight;
    document.getElementById('opacityValue').textContent = Math.round(this.state.opacity);
    document.getElementById('rotationValue').textContent = this.state.rotation;
  }

  downloadMockup() {
    if (!this.state.designImage || !this.state.mockupImage) {
      this.log('Tasarım ve şablon seçin', 'error');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = this.canvas.toDataURL('image/png');
      
      const timestamp = new Date().getTime();
      const templateName = this.state.selectedTemplate || 'mockup';
      link.download = `sezalab-${templateName}-${timestamp}.png`;
      
      link.click();
      this.log('Mockup indirildi', 'success');
    } catch (error) {
      this.log('İndirme hatası: ' + error.message, 'error');
    }
  }

  resetDesign() {
    // Değerleri sıfırla
    document.getElementById('posX').value = 100;
    document.getElementById('posY').value = 150;
    document.getElementById('designWidth').value = 200;
    document.getElementById('designHeight').value = 200;
    document.getElementById('opacity').value = 100;
    document.getElementById('rotation').value = 0;
    
    this.updateCanvas();
    this.log('Sıfırlandı', 'info');
  }

  log(message, type = 'info') {
    const statusBox = document.getElementById('statusBox');
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    statusBox.innerHTML = `
      <span>${icon}</span>
      <span style="margin-left: 0.5rem;">
        <strong>[${timestamp}]</strong> ${message}
      </span>
    `;

    // Otomatik temizle 5 saniye sonra
    setTimeout(() => {
      if (statusBox.innerHTML.includes(message)) {
        statusBox.innerHTML = '';
      }
    }, 5000);
  }
}

// App başlat
document.addEventListener('DOMContentLoaded', () => {
  window.mockupCreator = new MockupCreator();
});
