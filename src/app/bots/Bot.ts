import puppeteer from 'puppeteer'

export class Bot {
  protected browser: Promise<puppeteer.Browser>
  protected page: puppeteer.Page

  async createPage (options: puppeteer.LaunchOptions): Promise<void> {
    this.browser = new Promise((resolve, reject) => {
      puppeteer.launch(options)
        .then(b => resolve(b))
        .catch(err => reject(err))
    })
    this.page = await (await this.browser).newPage()
  }
}

export interface ProductProtocol{
  id?: string
  name: string
  historyId?: string
  price: number
  freight?: string
  parceledOut?: string
  link: string
}

export interface IBotRepository{
  createPage (options: puppeteer.LaunchOptions): Promise<void>
  searchProduct (product: string): Promise<void>
  sortByPrice (): Promise<void>
  getProductLinks (): Promise<string[]>
  getProductAttributes (linkProducts: string[]): Promise<ProductProtocol[]>
  execute (product: string): Promise<ProductProtocol[]>
}
