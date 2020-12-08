export interface IHttpResponse {
  statusCode: number,
  body: any
}

export class HttpResponse {
  static ok (data: any) : IHttpResponse {
    return {
      statusCode: 200,
      body: data
    }
  }

  static created (data: any) : IHttpResponse {
    return {
      statusCode: 201,
      body: data
    }
  }

  static updated (data: any) : IHttpResponse {
    return {
      statusCode: 202,
      body: data
    }
  }

  static noContent () : IHttpResponse {
    return {
      statusCode: 204,
      body: {}
    }
  }

  static badRequest (error: Error) : IHttpResponse {
    return {
      statusCode: 400,
      body: {
        error: error.message
      }
    }
  }

  static notAuthorized (error: Error): IHttpResponse {
    return {
      statusCode: 401,
      body: {
        error: error.message
      }
    }
  }

  static notFound (error: Error): IHttpResponse {
    return {
      statusCode: 404,
      body: {
        error: error.message
      }
    }
  }

  static paymentDenied (data: any): IHttpResponse {
    return {
      statusCode: 405,
      body: data
    }
  }

  static conflict (error: Error): IHttpResponse {
    return {
      statusCode: 409,
      body: {
        error: error.message
      }
    }
  }

  static invalidArgument (error: Error): IHttpResponse {
    return {
      statusCode: 422,
      body: {
        error: error.message
      }
    }
  }

  static serverError (error: Error): IHttpResponse {
    return {
      statusCode: 500,
      body: {
        error: error.message
      }
    }
  }
}
