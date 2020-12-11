export interface JobProtocol{
  key: string
  handle(data: any): Promise<any>
}
