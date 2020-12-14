import puppeteer from 'puppeteer'
import { Bot, IBotRepository, ProductProtocol } from './Bot'

export class BotMercadoLivre extends Bot implements IBotRepository {
  private readonly launchOptions: puppeteer.LaunchOptions
  constructor (options: puppeteer.LaunchOptions) {
    super()
    this.launchOptions = options
  }

  async searchProduct (product: string): Promise<void> {
    await this.createPage(this.launchOptions)
    await this.page.goto('https://www.mercadolivre.com.br/')
    await this.page.evaluate((product) => {
      const input = document.querySelector('input.nav-search-input') as HTMLInputElement
      input.value = product
      const buttonSearch = document.querySelector('button.nav-search-btn') as HTMLElement
      buttonSearch.click()
    }, product)
  }

  async sortByPrice (): Promise<void> {
    await this.page.waitForFunction("document.querySelector('button.andes-dropdown__trigger')")

    await this.page.evaluate(() => {
      const order = document.querySelector('button.andes-dropdown__trigger') as HTMLElement
      order.click()

      const priceAsc = document.querySelector("li.andes-list__item[value='price_asc'] a") as HTMLElement
      priceAsc.click()
    })
  }

  async getProductLinks (): Promise<string[]> {
    await this.page.waitForFunction("document.querySelector('span.andes-tooltip-button-close')")
    const linkProducts = await this.page.evaluate(() => {
      const btnClose = document.querySelector('span.andes-tooltip-button-close') as HTMLElement

      btnClose.click()
      const productsLink = document.querySelectorAll('div.andes-card.andes-card--flat.andes-card--default.ui-search-result.ui-search-result--core.andes-card--padding-default.andes-card--animated a.ui-search-link')

      let linksSelecteds = Array.from(productsLink)
        .filter(l => !l.classList.contains('ui-search-result__content'))
        .slice(0, 5)

      if (linksSelecteds.length === 0) {
        linksSelecteds = Array.from(document.querySelectorAll('div.ui-search-result__image a')).slice(0, 5)
      }
      const links = []
      linksSelecteds.forEach(l => {
        links.push(l.getAttribute('href'))
      })

      return links
    })

    return linkProducts
  }

  async getProductAttributes (linkProducts: string[]): Promise<ProductProtocol[]> {
    const products: ProductProtocol[] = []
    for (let i = 0; i < linkProducts.length; i++) {
      await this.page.goto(linkProducts[i])
      await this.page.waitForFunction("document.querySelector('img.ui-pdp-image.ui-pdp-gallery__figure__image')")
      const product: ProductProtocol = await this.page.evaluate(() => {
        const name = document.querySelector('h1.ui-pdp-title').innerHTML

        const price = document.querySelector('span.price-tag.ui-pdp-price__part meta').getAttribute('content')
        const freightElement = document.querySelector('h2.ui-pdp-color--GREEN.ui-pdp-media__title')

        let freight: string
        if (freightElement) {
          freight = freightElement.innerHTML
        }

        let parceledOut: string
        const parceledOutBlack = document.querySelector('p.ui-pdp-color--BLACK.ui-pdp-size--MEDIUM.ui-pdp-family--REGULAR') as HTMLElement
        if (parceledOutBlack) {
          parceledOut = parceledOutBlack.innerText
        } else {
          const parceledOutGreen = document.querySelector('p.ui-pdp-color--GREEN.ui-pdp-size--MEDIUM.ui-pdp-family--REGULAR') as HTMLElement
          parceledOut = parceledOutGreen.innerText
        }

        return {
          name,
          price: Number(price),
          freight,
          parceledOut: parceledOut.replace(/\n/g, ''),
          link: window.location.href
        }
      })

      products.push(product)
    }

    return products
  }

  async execute (product: string): Promise<ProductProtocol[]> {
    await this.searchProduct(product)
    await this.sortByPrice()
    const productsLink = await this.getProductLinks()
    const products = await this.getProductAttributes(productsLink)

    await (await this.browser).close()

    return products
  }
}

// (async () => {
//   const bot = new BotMercadoLivre({ headless: false, defaultViewport: { width: 1360, height: 720 } })
//   const result = await bot.execute('Base ruby rose feels')

//   console.log(result)
// })()
