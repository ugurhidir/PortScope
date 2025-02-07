# PortScope

PortScope is a powerful and user-friendly network port scanner built with Python and Flask. It allows you to quickly scan a target host (IP address or hostname) for open ports, detect running services and their versions, and even attempt operating system detection.  It provides results in multiple formats (HTML, JSON, and plain text).

## Features

*   **Port Scanning:** Scan a range of ports or individual ports on a target host.
*   **Service Detection:** Identify the services running on open ports (e.g., HTTP, SSH, FTP).
*   **Version Detection:** Determine the versions of the detected services.
*   **Operating System Detection (Optional):** Attempt to identify the target's operating system (requires Nmap's `-O` option, which may need root/administrator privileges).
*   **Multiple Output Formats:** Get results in HTML, JSON, or plain text.
*   **Web Interface:** Easy-to-use web interface built with Flask.
*   **Common Ports Option:** Quickly scan a predefined list of common ports.
*   **Customizable Port Ranges:** Scan single ports, comma-separated ports, or port ranges (e.g., 20-25, 80, 443, 8000-8080).

## Prerequisites (IMPORTANT!)

**PortScope *requires* Nmap and Npcap to be installed on the target system.**  The `.exe` file (created with PyInstaller) *does not* include these dependencies.

*   **Nmap:**  Download and install Nmap from: [https://nmap.org/download.html](https://nmap.org/download.html)
    *   **Windows:** Download the "Windows self-installer" (e.g., `nmap-<version>-setup.exe`).  During installation, make sure to select the option to **"Add Nmap to the system PATH"**.
    *   **Linux:** Use your distribution's package manager.  For example:
        *   **Debian/Ubuntu:** `sudo apt-get update && sudo apt-get install nmap`
        *   **Fedora/CentOS/RHEL:** `sudo dnf install nmap`
        *   **Arch Linux:** `sudo pacman -S nmap`
*   **Npcap:** Download and install Npcap from: [https://npcap.com/#download](https://npcap.com/#download)
    *   **Windows:** Download the "Installer for Windows" (e.g., `npcap-<version>.exe`). During installation, it's generally recommended to select "Install Npcap in WinPcap API-compatible Mode".
    * **Linux:** Npcap is *not* typically required on Linux. The Linux kernel's built-in packet capture capabilities are usually sufficient.  If you *do* need Npcap on Linux (which is rare), you'll need to compile it from source, and the instructions will vary depending on your distribution.  Refer to the Npcap website for details.  *For most Linux users, you can ignore Npcap.*

## Installation (Windows - .exe)

1.  Download the `PortScope.exe` file.
2.  Make sure Nmap and Npcap are installed (see Prerequisites above).
3.  Double-click the `PortScope.exe` file to launch the application.  This will start a local web server.
4.  Open your web browser and go to `http://localhost:5000` (or `http://127.0.0.1:5000`).

## Installation (Windows/Linux/macOS - from Source)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ugurhidir/PortScope.git  # Replace <repository_url> with the actual URL
    cd <repository_directory>  # Replace <repository_directory> with the directory name
    ```
    Or download the source code as a ZIP file and extract it.

2.  **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv .venv  # Or use a different name for the virtual environment
    ```

3.  **Activate the virtual environment:**

    *   **Windows (cmd):**
        ```bash
        .venv\Scripts\activate
        ```
    *   **Windows (PowerShell):**
        ```powershell
        .venv\Scripts\Activate.ps1
        ```
    *   **Linux/macOS:**
        ```bash
        source .venv/bin/activate
        ```

4.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the application:**

    ```bash
    python app.py
    ```
    Or on some systems:
     ```bash
    python3 app.py
    ```

6.  Open your web browser and go to `http://localhost:5000` (or `http://127.0.0.1:5000`).  You can also access it from other devices on your local network using your computer's IP address (e.g., `http://192.168.1.100:5000`, replace `192.168.1.100` with your computer's actual IP address).

## Usage

1.  **Target IP/Host:** Enter the IP address (e.g., `192.168.1.1`) or hostname (e.g., `scanme.nmap.org`) of the target you want to scan.
2.  **Ports:** Enter the port(s) you want to scan.  You can specify:
    *   Single ports (e.g., `80`)
    *   Comma-separated ports (e.g., `80,443,22`)
    *   Port ranges (e.g., `20-25`, `8000-8080`)
    *   A combination of the above (e.g., `22,80,443,8000-8080`)
3.  **Common Ports:** Check the "Yaygın Portları Ekle" (Add Common Ports) checkbox to include a predefined list of common ports in your scan.
4.  **Options:**
    *   **Sadece Açık Portları Göster (Show Open Ports Only):**  Only display open ports in the results.
    *   **Servisleri/Versiyonları Tespit Et (Detect Services/Versions):**  Attempt to identify the services and their versions running on open ports (uses Nmap's `-sV` option).
    *   **İşletim Sistemini Tespit Et (Detect OS):** Attempt to identify the target's operating system (uses Nmap's `-O` option).  *Note: This may require administrator/root privileges.*
5.  **Taramayı Başlat (Start Scan):** Click the button to start the scan.
6.  **Results:** The results will be displayed in a list below the form.
7. **Download Report**: After the scan, buttons to download report will show. You can download report in HTML, JSON or Text format.

## License

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.  *You'll need to create a `LICENSE` file and include the MIT License text.*

---

# PortScope (TR)

PortScope, Python ve Flask ile geliştirilmiş, kullanımı kolay ve güçlü bir ağ port tarayıcısıdır.  Bir hedef sunucudaki (IP adresi veya alan adı) açık portları hızlıca taramanıza, çalışan servisleri ve versiyonlarını tespit etmenize ve hatta işletim sistemini belirlemeye çalışmanıza olanak tanır. Sonuçları birden fazla formatta (HTML, JSON ve düz metin) sunar.

## Özellikler

*   **Port Tarama:** Bir hedef sunucudaki belirli portları veya port aralıklarını tarayın.
*   **Servis Tespiti:** Açık portlarda çalışan servisleri (örneğin, HTTP, SSH, FTP) belirleyin.
*   **Versiyon Tespiti:** Tespit edilen servislerin versiyonlarını öğrenin.
*   **İşletim Sistemi Tespiti (İsteğe Bağlı):** Hedefin işletim sistemini belirlemeye çalışın (Nmap'in `-O` seçeneğini kullanır, yönetici/root yetkileri gerektirebilir).
*   **Çoklu Çıktı Formatları:** Sonuçları HTML, JSON veya düz metin olarak alın.
*   **Web Arayüzü:** Flask ile oluşturulmuş, kullanımı kolay web arayüzü.
*   **Yaygın Portlar Seçeneği:** Önceden tanımlanmış yaygın portları hızlıca tarayın.
*   **Özelleştirilebilir Port Aralıkları:** Tek portları, virgülle ayrılmış portları veya port aralıklarını (örneğin, 20-25, 80, 443, 8000-8080) tarayın.

## Ön Koşullar (ÖNEMLİ!)

**PortScope'un çalışması için, hedef sistemde Nmap ve Npcap'in *kurulu olması gerekir*.**  `.exe` dosyası (PyInstaller ile oluşturulmuş) bu bağımlılıkları *içermez*.

*   **Nmap:** Nmap'i şu adresten indirip kurun: [https://nmap.org/download.html](https://nmap.org/download.html)
    *   **Windows:** "Windows self-installer"ı (örneğin, `nmap-<version>-setup.exe`) indirin. Kurulum sırasında, **"Add Nmap to the system PATH"** seçeneğini işaretlemeyi unutmayın.
    *   **Linux:** Dağıtımınızın paket yöneticisini kullanın.  Örneğin:
        *   **Debian/Ubuntu:** `sudo apt-get update && sudo apt-get install nmap`
        *   **Fedora/CentOS/RHEL:** `sudo dnf install nmap`
        *   **Arch Linux:** `sudo pacman -S nmap`
*   **Npcap:** Npcap'i şu adresten indirip kurun: [https://npcap.com/#download](https://npcap.com/#download)
    *   **Windows:** "Installer for Windows"ı (örneğin, `npcap-<version>.exe`) indirin.  Kurulum sırasında, "Install Npcap in WinPcap API-compatible Mode" seçeneğini işaretlemeniz genellikle önerilir.
    * **Linux:** Linux'ta Npcap'e genellikle *gerek yoktur*. Linux çekirdeğinin yerleşik paket yakalama yetenekleri genellikle yeterlidir. Eğer *gerçekten* Linux'ta Npcap'e ihtiyacınız varsa (bu nadir bir durumdur), onu kaynaktan derlemeniz gerekir ve talimatlar dağıtımınıza göre değişir. Npcap web sitesine bakın. *Çoğu Linux kullanıcısı için Npcap'i yok sayabilirsiniz.*

## Kurulum (Windows - .exe)

1.  `PortScope.exe` dosyasını indirin.
2.  Nmap ve Npcap'in kurulu olduğundan emin olun (bkz. Ön Koşullar).
3.  Uygulamayı başlatmak için `PortScope.exe` dosyasına çift tıklayın. Bu, yerel bir web sunucusu başlatacaktır.
4.  Web tarayıcınızı açın ve `http://localhost:5000` (veya `http://127.0.0.1:5000`) adresine gidin.

## Kurulum (Windows/Linux/macOS - Kaynaktan)

1.  **Depoyu klonlayın:**
    ```bash
    git clone <depo_url>  # <depo_url> yerine gerçek URL'yi yazın
    cd <depo_dizini>    # <depo_dizini> yerine dizin adını yazın
    ```
    Veya kaynak kodunu ZIP dosyası olarak indirip açın.

2.  **Sanal ortam oluşturun (önerilir):**

    ```bash
    python3 -m venv .venv  # Veya sanal ortam için farklı bir isim kullanın
    ```

3.  **Sanal ortamı etkinleştirin:**

    *   **Windows (cmd):**
        ```bash
        .venv\Scripts\activate
        ```
    *   **Windows (PowerShell):**
        ```powershell
        .venv\Scripts\Activate.ps1
        ```
    *   **Linux/macOS:**
        ```bash
        source .venv/bin/activate
        ```

4.  **Bağımlılıkları yükleyin:**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Uygulamayı çalıştırın:**

    ```bash
    python app.py
    ```
    veya bazı sistemlerde
    ```bash
    python3 app.py
    ```

6.  Web tarayıcınızı açın ve `http://localhost:5000` (veya `http://127.0.0.1:5000`) adresine gidin.  Ayrıca, yerel ağınızdaki diğer cihazlardan bilgisayarınızın IP adresini kullanarak da erişebilirsiniz (örneğin, `http://192.168.1.100:5000`, `192.168.1.100` yerine bilgisayarınızın gerçek IP adresini yazın).

## Kullanım

1.  **Hedef IP/Host:** Taramak istediğiniz hedefin IP adresini (örneğin, `192.168.1.1`) veya alan adını (örneğin, `scanme.nmap.org`) girin.
2.  **Portlar:** Taramak istediğiniz port(lar)ı girin. Şunları belirtebilirsiniz:
    *   Tek portlar (örneğin, `80`)
    *   Virgülle ayrılmış portlar (örneğin, `80,443,22`)
    *   Port aralıkları (örneğin, `20-25`, `8000-8080`)
    *   Yukarıdakilerin bir kombinasyonu (örneğin, `22,80,443,8000-8080`)
3.  **Yaygın Portlar:** Önceden tanımlanmış yaygın portların bir listesini taramanıza dahil etmek için "Yaygın Portları Ekle" onay kutusunu işaretleyin.
4.  **Seçenekler:**
    *   **Sadece Açık Portları Göster:** Sonuçlarda yalnızca açık portları göster.
    *   **Servisleri/Versiyonları Tespit Et:** Açık portlarda çalışan servisleri ve versiyonlarını belirlemeye çalışın (Nmap'in `-sV` seçeneğini kullanır).
    *   **İşletim Sistemini Tespit Et:** Hedefin işletim sistemini belirlemeye çalışın (Nmap'in `-O` seçeneğini kullanır). *Not: Bu, yönetici/root yetkileri gerektirebilir.*
5.  **Taramayı Başlat:** Taramayı başlatmak için butona tıklayın.
6.  **Sonuçlar:** Sonuçlar, formun altında bir listede gösterilecektir.
7. **Raporu İndir:** Tarama bittikten sonra, raporu indirmek için butonlar görünür. Raporu, HTML, JSON veya Text formatlarında indirebilirsiniz.

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır - ayrıntılar için `LICENSE` dosyasına bakın. *Bir `LICENSE` dosyası oluşturmanız ve MIT Lisansı metnini eklemeniz gerekecektir.*