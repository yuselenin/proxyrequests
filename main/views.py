# -*- coding: utf-8 -*-
from django.http import HttpResponse
import requests
import json
import re
from bs4 import BeautifulSoup

def index(request):
    request_url = request.META['PATH_INFO']+ request.META['QUERY_STRING']
    if request.method == "GET":
        if request.META['PATH_INFO'] == '/':
            request_url = '/invierte/consultaPublica/consultaAvanzada'
            main_get_response = requests.get('https://ofi5.mef.gob.pe'+request_url) 
            return HttpResponse(
                main_get_response.text.replace(
                'href="/','href="https://ofi5.mef.gob.pe/'
                ).replace(
                    'src="/','src="https://ofi5.mef.gob.pe/'
                    ).replace(
                        'https://ofi5.mef.gob.pe/invierte/Scripts/consultaPublica/consultaAvanzada.js?v=636772851784304016','https://raw.githubusercontent.com/yuselenin/invierte/master/static/js/script.js')
                )
        response = requests.get('https://ofi5.mef.gob.pe'+request_url)
    if request.method == "POST":
        regex = re.compile('^HTTP_')
        headers = dict((regex.sub('', header), value) for (header, value) in request.META.items() if header.startswith('HTTP_'))
        data = request.POST
        if request.is_ajax() and request.body:
            data = json.loads(request.body)
        response = requests.post('https://ofi5.mef.gob.pe'+request_url, data=data, headers=headers)    
        if request_url == '/invierte/ConsultaPublica/traeListaProyectoConsultaAvanzada':
            data_json = response.json()
            for i in data_json['Data']:
                print(i['Codigo'])
                if i['Marco'] =="SNIP": 
                    titulo_response = requests.get('http://ofi4.mef.gob.pe/bp/ConsultarPIP/titulo.asp?donde=consulta&codigo=%s&version=1&ed='%i['Codigo'])
                    i['DocumentosDeViabiliadad'] = 'ofi4.mef.gob.pe/appFs/ListaPIP.aspx?pip=' in titulo_response.text
                    ficha_response = requests.get('http://ofi4.mef.gob.pe/bp/ConsultarPIP/PIP.asp?codigo=%s&version=1&ed='%i['Codigo'])
                    soup = BeautifulSoup(ficha_response.content, "html.parser")
                    tabla_3 = soup.find_all("table", class_= "tablas")[2]
                    #tr=tabla_3.find_all('tr')[1]
                    i['Alternativa1']=str(tr.find_all('td')[2].get_text()).strip()
                    i['Alternativa2']=str(tr.find_all('td')[3].get_text()).strip()
                    i['Alternativa3']=str(tr.find_all('td')[4].get_text()).strip()
                    #i['TablaIndicadores']=str(tabla_3)
                else:
                    pass
            return HttpResponse(json.dumps(data_json))
    return HttpResponse(response.content)