from flask import Flask, render_template, request, jsonify, Response
import nmap
import ipaddress
import re
import socket
import json
import os
import sys

# PyInstaller için statik ve şablon dosyalarının yolunu belirtme
# Bu kısım, .exe oluşturulduğunda, Flask'in static ve templates
# klasörlerini doğru yerde bulabilmesini sağlar.
if getattr(sys, 'frozen', False):  # Eğer exe içindeysek (PyInstaller ile paketlenmişse)
    template_folder = os.path.join(sys._MEIPASS, 'templates')
    static_folder = os.path.join(sys._MEIPASS, 'static')
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
else:  # Eğer normal Python betiği olarak çalışıyorsa
    app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scan', methods=['POST'])
def scan_ports():
    try:
        target_host = request.json.get('target')
        if not target_host:
            return jsonify({'error': 'Hedef IP/Host gereklidir'}), 400

        # Hedefin IP adresi mi, hostname mi olduğunu belirle ve gerekirse çözümle
        try:
            ipaddress.ip_address(target_host)  # Önce IP adresi mi diye kontrol et
            target_ip = target_host  # Eğer IP adresiyse, olduğu gibi kullan
        except ValueError:
            # IP adresi değilse, hostname'dir. Çözümlemeye çalış.
            try:
                target_ip = socket.gethostbyname(target_host)  # Hostname'i IP'ye çevir
            except socket.gaierror:  # Çözümleme hatası (örneğin, geçersiz hostname)
                return jsonify({'error': 'Geçersiz hostname veya IP adresi'}), 400

        ports_to_scan = request.json.get('ports')
        if not ports_to_scan:
            return jsonify({'error': 'Port aralığı gereklidir'}), 400

        ports_string = ",".join(map(str, ports_to_scan))
        if not re.match(r'^(\d+(-\d+)?)(,\d+(-\d+)?)*$', ports_string):
            return jsonify({'error': "Geçersiz port formatı. Örnek: 80, 8080, 20-25"}), 400

        for port_str in ports_string.split(','):
            if '-' in port_str:
                start, end = map(int, port_str.split('-'))
                if start > end or start < 1 or end > 65535:
                    return jsonify({'error': 'Geçersiz port aralığı'}), 400
            else:
                port = int(port_str)
                if port < 1 or port > 65535:
                    return jsonify({'error': 'Geçersiz port numarası'}), 400

        show_open_only = request.json.get('options', {}).get('showOpenOnly', False)
        detect_services = request.json.get('options', {}).get('detect_services', False)
        detect_os = request.json.get('options', {}).get('detect_os', False)

        scan_options = ""
        if show_open_only:
            scan_options += " --open"
        if detect_services:
            scan_options += " -sV"
        if detect_os:
            scan_options += " -O"  # DİKKAT: -O root yetkisi gerektirebilir!

        nm = nmap.PortScanner()
        # nm.scan() hostname de kabul ediyor, ama biz IP'ye çevirerek daha kontrollü oluyoruz.
        nm.scan(target_ip, ports_string, arguments=scan_options)
        scan_results = nm.all_hosts()

        results_to_return = []
        for host in scan_results:
            if nm[host].state() == 'up':
                host_data = {}
                for proto in nm[host].all_protocols():
                    ports_data = []
                    ports = list(nm[host][proto].keys())
                    ports.sort()
                    for port in ports:
                        port_info = nm[host][proto][port]
                        ports_data.append({
                            'port': port,
                            'state': port_info['state'],
                            'service': port_info.get('name', 'unknown'),
                            'product': port_info.get('product', ''),
                            'version': port_info.get('version', ''),
                            'extrainfo': port_info.get('extrainfo', ''),
                            'conf': port_info.get('conf', ''),
                            'cpe': port_info.get('cpe', ''),
                            'reason': port_info.get('reason', '')
                        })
                host_data[proto] = ports_data
                results_to_return.append({'ip': host, 'scan_data': host_data})  # host ve port

            if detect_os and 'osmatch' in nm[host]:
                os_matches = []
                for osmatch in nm[host]['osmatch']:
                    os_info = {
                        'os_name': osmatch.get('name', 'unknown'),
                        'os_accuracy': osmatch.get('accuracy', ''),
                        'os_type': '',
                        'os_vendor': '',
                        'os_family': '',
                        'os_gen': ''
                    }
                    if 'osclass' in osmatch and osmatch['osclass']:
                        osclass = osmatch['osclass'][0]
                        os_info['os_type'] = osclass.get('type', '')
                        os_info['os_vendor'] = osclass.get('vendor', '')
                        os_info['os_family'] = osclass.get('osfamily', '')
                        os_info['os_gen'] = osclass.get('osgen', '')
                    os_matches.append(os_info)
                results_to_return.append({'ip': host, 'os_info': os_matches})  # ip ve os_info


        return jsonify({'results': results_to_return})

    except nmap.nmap.PortScannerError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': "Beklenmeyen bir hata oluştu: " + str(e)}), 500


@app.route('/report/<format>')
def generate_report(format):
    scan_results_json = request.args.get('results')
    if not scan_results_json:
        return "No scan results provided!", 400

    try:
        scan_results = json.loads(scan_results_json)
    except json.JSONDecodeError:
        return "Invalid scan results format!", 400

    if format == 'html':
        rendered_report = render_template('report_template.html', results=scan_results)
        return Response(rendered_report, mimetype='text/html')

    # PDF oluşturma kısmı KALDIRILDI
    # elif format == 'pdf':
    #     html_content = render_template('report_template.html', results=scan_results)
    #     pdf_content = HTML(string=html_content).write_pdf()
    #     return Response(pdf_content, mimetype='application/pdf',
    #                     headers={'Content-Disposition': 'attachment;filename=port_scan_report.pdf'})

    elif format == 'json':
        return jsonify(scan_results)

    elif format == 'text':
        text_report = generate_text_report(scan_results)  # Düz metin raporu oluştur
        return Response(text_report, mimetype='text/plain')

    else:
        return "Unsupported report format!", 400  # Veya bu satırı tamamen kaldırabilirsiniz.


def generate_text_report(scan_results):
    report = ""
    for result in scan_results:
        if 'scan_data' in result:
            report += f"IP Adresi: {result['ip']}\n"
            for proto, ports in result['scan_data'].items():
                report += f"  Protokol: {proto}\n"
                for port_data in ports:
                    report += f"    Port: {port_data['port']}/{port_data['state']} - Servis: {port_data['service']} " \
                              f"({port_data['product']} {port_data['version']}) {port_data['extrainfo']}\n"
        elif 'os_info' in result:
            if result['os_info']:  # Boş değilse yazdır
                report += f"İşletim Sistemi Bilgisi (IP: {result['ip']}):\n"
                for os in result['os_info']:
                    report += f"  - OS: {os['os_name']} (%{os['os_accuracy']})\n"
                    report += f"    Tip: {os['os_type']}, Üretici: {os['os_vendor']}, Aile: {os['os_family']}, Versiyon: {os['os_gen']}\n"
    report += "\n"

    return report


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)