import requests
import faker
import random
import time
import datetime
import functools

class PopulateDbErp:
  def __init__(self, baseUrl):
      self.baseUrl = baseUrl
      self.token = ''
      self.headers = ''
      self.email = ''
      self.password = ''
      self.products = []

  def signUp(self, name, email, password):
    body = {
      'name': name,
      'email': email,
      'password': password,
      'confirmPassword': password
    }
    self.email = email
    self.password = password
    response = requests.post(f'{self.baseUrl}/api/signUp', json=body)
    return response
  
  def signIn(self):
    body = {
      'email': self.email,
      'password': self.password
    }

    response = requests.post(f'{self.baseUrl}/api/signin', json=body)
    self.token = response.json()['token']
    self.headers = {'Authorization': f'Bearer {self.token}'}
    return response

  def createProduct(self, name, brand, saleValue, unitaryValue, amount = 0):
    body = {
    "name": name,
    "brand": brand,
    "saleValue": saleValue,
    "amount":  amount
    }

    response = requests.post(f'{self.baseUrl}/api/products', headers=self.headers, json=body)
    if response.status_code == 201:
      self.products.append({ 'product': response.json(), 'unitaryValue': unitaryValue })
    return response

  def createShipments(self, provider, maxAmount):
    productsBase = []
    for i in range(0, random.randint(1, len(self.products))):
      productsBase.append(self.products[1 - random.randint(1, len(self.products))])

    productsFinal = []
    for i in productsBase:
      productsFinal.append({
        'id': i['product']['id'],
        'unitaryValue': i['unitaryValue'],
        'amount': random.randint(1, maxAmount)
      })

    body = {
      'products': productsFinal,
      'provider': provider
    }

    response = requests.post(f'{self.baseUrl}/api/shipments', headers=self.headers, json=body)
    return response
  
  def createSales(self, amount):
    fk = faker.Faker()
    productsBase = []

    for i in range(0, random.randint(1, len(self.products))):
      productsBase.append(self.products[1 - random.randint(1, len(self.products))])
    
    productsFinal = []
    for i in productsBase:
      productsFinal.append({
        'id': i['product']['id'],
        'unitaryValue': i['product']['saleValue'],
        'unitaryDiscount': random.randint(1, 20),
        'amount': amount
      })

    randomPartial = random.randint(1, 2)

    body = {      
      'partialPayment': False if randomPartial == 1 else True,
      'products': productsFinal,
      'confirmPay': True,
      'nameCliente': fk.name()
    }

    def valueProducts(product):
      discount = product['unitaryDiscount']
      result = product['unitaryValue'] - discount
      result *= product['amount']
      return result

    if randomPartial == 2:
      mapValueProducts = map(valueProducts, productsFinal)
      saleValue = functools.reduce(lambda a, b: a + b, mapValueProducts)
      body['amountPaid'] = saleValue - saleValue * 0.3
      body['remainingAmount'] = saleValue * 0.3
      body['payDate'] = '2020-01-10'
    else:
      body['payDate'] = '2020-12-24'

    print(body)
    response = requests.post(f'{self.baseUrl}/api/sales', headers=self.headers, json=body)
    return response

users = [
  {
    'user': {
      'name': 'Andrei',
      'email': 'andreeiruan@gmail.com',
      'password': 'teste123'
    },
    'products': [
      {
      'name': 'Notebooke aspire 5',
      'brand': 'Acer',
      'saleValue': 1999.99,
      'unitaryValue': 1299.99
      },
      {
      'name': 'Teclado Mitra',
      'brand': 'Redragon',
      'saleValue': 199.99,
      'unitaryValue': 129.99
      },
      {
      'name': 'Teclado tgb',
      'brand': 'Dazz',
      'saleValue': 99.99,
      'unitaryValue': 69.99
      },
      {
      'name': 'Mouse G502',
      'brand': 'Logitech',
      'saleValue': 249.99,
      'unitaryValue': 199.99
      },
      {
      'name': 'Mouse cobra',
      'brand': 'Razer',
      'saleValue': 349.99,
      'unitaryValue': 229.99
      },
      {
      'name': 'Monitor 25pol',
      'brand': 'Samsung',
      'saleValue': 949.99,
      'unitaryValue': 699.99
      },
      {
      'name': 'Roteador dual band',
      'brand': 'Huawei',
      'saleValue': 79.99,
      'unitaryValue': 59.99
      },
    ],
    'providers': ['Kabum', 'Pichau', 'Olx']  
  },
  {
    'user': {
      'name': 'Emanuele',
      'email': 'manuu@gmail.com',
      'password': 'teste123'
    },
    'products': [
      {
      'name': 'Base 4',
      'brand': 'Ruby Rose',
      'saleValue': 19.99,
      'unitaryValue': 9.99
      },
      {
      'name': 'Hidratante',
      'brand': 'Dove',
      'saleValue': 9.99,
      'unitaryValue': 6.99
      },
      {
      'name': 'agua micelar',
      'brand': 'Avon',
      'saleValue': 23.99,
      'unitaryValue': 11.99
      },
      {
      'name': 'Pincel',
      'brand': 'Marca',
      'saleValue': 19.99,
      'unitaryValue': 13.99
      },
      {
      'name': 'Esmalte',
      'brand': 'Boticario',
      'saleValue': 9.99,
      'unitaryValue': 5.99
      }
    ],
    'providers': ['Mercado Livre', 'Shopee', 'Wish']  
  },
]

for i in users:
  populateDb = PopulateDbErp('http://127.0.0.1:3333')
  response = populateDb.signUp(i['user']['name'], i['user']['email'], i['user']['password'])
  if response.status_code == 409:
    print(f'BREAK {response.status_code}')
    break
  if response.status_code != 201:
    print(f'ALERT {response.status_code}')

  response = populateDb.signIn()
  if response.status_code != 201:
    print(f'ALERT {response.status_code}')

  for p in i['products']:
    response = populateDb.createProduct(p['name'], p['brand'], p['saleValue'], p['unitaryValue'])
    if response.status_code != 201:
      print(f'ALERT {response.status_code}')

  for p in i['providers']:
    response = populateDb.createShipments(p, 5)
    if response.status_code != 201:
      print(f'ALERT {response.status_code}')
    # time.sleep(3)
    print(response.json())

  for i in range(0, 5):
    response = populateDb.createSales(1)
    if response.status_code != 201:
      print(f'ALERT {response.status_code}: {response.json()}')
    print(response.json())
    # time.sleep(3)
