from bs4 import BeautifulSoup
import requests
import json

base_url = 'https://www.futbin.com/20/playerGraph?type=today&year=20&player='


def extract_data(request):

    url = extract_parameter(request)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, features="html.parser")

    player_id_section = soup.find_all('div', {'class': 'pversion'})[1]
    player_id = player_id_section.find('a')['data-resource'].replace('p', '')

    url_hourly = base_url + str(player_id)

    response_hourly = requests.get(url_hourly)
    soup_hourly = BeautifulSoup(
        response_hourly.text,
        features="html.parser")

    return json.dumps(soup_hourly.getText())


def extract_parameter(request):
    request_json = request.get_json(silent=True)
    request_args = request.args
    if request_json and 'url' in request_json:
        url = request_json['url']
    elif request_args and 'url' in request_args:
        url = request_args['url']
    return url
