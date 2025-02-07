document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scan-button');
    const targetInput = document.getElementById('target');
    const portsInput = document.getElementById('ports');
    const commonPortsCheckbox = document.getElementById('common-ports');
    const commonPortsList = document.getElementById('common-ports-list');
    const showOpenOnlyCheckbox = document.getElementById('show-open-only');
    const detectServicesCheckbox = document.getElementById('detect-services');
    const detectOsCheckbox = document.getElementById('detect-os');
    const progressDiv = document.getElementById('progress');
    const portList = document.getElementById('port-list');
    const downloadButtonsDiv = document.getElementById('download-buttons');

    let scanResults = null;

    createCommonPortsCheckboxes();

    commonPortsCheckbox.addEventListener('change', () => {
        commonPortsList.style.display = commonPortsCheckbox.checked ? 'block' : 'none';
    });

    scanButton.addEventListener('click', async () => {
        const target = targetInput.value;
        let ports = parsePorts(portsInput.value);

        if (commonPortsCheckbox.checked) {
            const selectedCommonPorts = Array.from(commonPortsList.querySelectorAll('input[name="common-port"]:checked'))
                .map(checkbox => parseInt(checkbox.value,10));
            ports = [...new Set([...ports, ...selectedCommonPorts])];
        }

        if (!target) {
            displayError('Hedef IP/Host gereklidir!');
            return;
        }
        if (ports.length === 0) {
            displayError('En az bir port belirtilmelidir!');
            return;
        }

        const data = {
            target: target,
            ports: ports,
            options: {
                showOpenOnly: showOpenOnlyCheckbox.checked,
                detect_services: detectServicesCheckbox.checked,
                detect_os: detectOsCheckbox.checked
            }
        };

        progressDiv.textContent = 'Taranıyor...';
        portList.innerHTML = '';
        downloadButtonsDiv.style.display = 'none';

        try {
            const response = await fetch('/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP Hatası: ${response.status}`);
            }

            const receivedData = await response.json();
            scanResults = receivedData.results;
            const results = receivedData.results;

            progressDiv.textContent = '';

            if (results.length === 0) {
                displayMessage('Hiç sonuç bulunamadı.');
                return;
            }

            results.forEach(result => {
              if(result.os_info){
                if(showOpenOnlyCheckbox.checked) return;
                result.os_info.forEach(os => {
                    const listItem = document.createElement('li');

                    listItem.innerHTML = `
                        <strong>İşletim Sistemi:</strong> ${DOMPurify.sanitize(os.os_name)} (${DOMPurify.sanitize(os.os_accuracy)}% doğruluk)<br>
                        <strong>Tip:</strong> ${DOMPurify.sanitize(os.os_type)}<br>
                        <strong>Üretici:</strong> ${DOMPurify.sanitize(os.os_vendor)}<br>
                        <strong>Ailesi:</strong> ${DOMPurify.sanitize(os.os_family)}<br>
                        <strong>Versiyon:</strong> ${DOMPurify.sanitize(os.os_gen)}
                    `;
                    listItem.classList.add('os-info');
                    portList.appendChild(listItem);

                });
              }
              else{
                for (const protocol in result.scan_data) {
                    const ports_data = result.scan_data[protocol];
                    ports_data.forEach(port_data => {

                      if (showOpenOnlyCheckbox.checked && port_data.state !== 'open') {
                        return;
                      }
                      const listItem = document.createElement('li');
                      listItem.innerHTML = `
                          <strong>Port:</strong> ${DOMPurify.sanitize(port_data.port)}/${DOMPurify.sanitize(port_data.state)}
                          <br><strong>Servis:</strong> ${DOMPurify.sanitize(port_data.service)}
                          ${port_data.version ? `<br><strong>Versiyon:</strong> ${DOMPurify.sanitize(port_data.version)}` : ''}
                          ${port_data.product ? `<br><strong>Ürün:</strong> ${DOMPurify.sanitize(port_data.product)}` : ''}
                          ${port_data.extrainfo ? `<br><strong>Ek Bilgi:</strong> ${DOMPurify.sanitize(port_data.extrainfo)}` : ''}
                          ${port_data.conf ? `<br><strong>Güven:</strong> %${DOMPurify.sanitize(port_data.conf)}` : ''}
                          ${port_data.cpe ? `<br><strong>CPE:</strong> ${DOMPurify.sanitize(port_data.cpe)}` : ''}
                          ${port_data.reason ? `<br><strong>Sebep:</strong> ${DOMPurify.sanitize(port_data.reason)}` : ''}
                      `;
                      listItem.classList.add(port_data.state === 'open' ? 'open' : 'closed');
                      portList.appendChild(listItem);
                    });

                }
              }
            });
            downloadButtonsDiv.style.display = 'block';

        } catch (error) {
            progressDiv.textContent = '';
            displayError('Hata: ' + error.message);
            console.error('Tarama hatası:', error);
        }
    });

    // İndirme butonlarına tıklanınca
    downloadButtonsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('download-button')) {
            const format = event.target.dataset.format;
            if (scanResults) {
                const reportUrl = `/report/${format}?results=${encodeURIComponent(JSON.stringify(scanResults))}`;
                window.location.href = reportUrl; // İndirmeyi başlat
            }
        }
    });

    // Yaygın portların checkbox'larını dinamik olarak oluştur
    function createCommonPortsCheckboxes() {
        const commonPorts = [
            { port: 21, name: 'FTP' },
            { port: 22, name: 'SSH' },
            { port: 23, name: 'Telnet' },
            { port: 25, name: 'SMTP' },
            { port: 53, name: 'DNS' },
            { port: 80, name: 'HTTP' },
            { port: 110, name: 'POP3' },
            { port: 143, name: 'IMAP' },
            { port: 443, name: 'HTTPS' },
            { port: 465, name: 'SMTPS' },
            { port: 587, name: 'SMTP Submission' },
            { port: 993, name: 'IMAPS' },
            { port: 995, name: 'POP3S' },
            { port: 3306, name: 'MySQL' },
            { port: 3389, name: 'RDP' },
            { port: 5432, name: 'PostgreSQL' },
            { port: 5900, name: 'VNC' },
            { port: 8000, name: 'HTTP Alternate' },
            { port: 8080, name: 'HTTP Alternate' }
            // İstediğiniz kadar ekleyebilirsiniz
        ];

        commonPorts.forEach(portInfo => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'common-port';
            checkbox.value = portInfo.port;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${portInfo.port} (${portInfo.name})`));
            commonPortsList.appendChild(label);
        });
    }

     // Portları ayrıştır (string'i sayı dizisine çevir)
    function parsePorts(portsInput) {
        const portStrings = portsInput.split(',');
        let ports = [];
        for (const portString of portStrings) {
            if (portString.includes('-')) {
                const [start, end] = portString.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    ports.push(i);
                }
            } else {
                const port = parseInt(portString, 10);
                if (!isNaN(port)) {
                    ports.push(port);
                }
            }
        }
        return ports;
    }


    function displayError(message) {
        const listItem = document.createElement('li');
        listItem.textContent = message;
        listItem.classList.add('error');
        portList.appendChild(listItem);
    }

    function displayMessage(message) {
        const listItem = document.createElement('li');
        listItem.textContent = message;
        portList.appendChild(listItem);
    }
});