/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from './constants';

export enum Method {
  Get = 'GET',
  Put = 'PUT',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Options = 'OPTIONS',
}

type CommonParams = {
  url: string;
  query?: Record<string, string | null | undefined>;
  headers?: Record<string, string>;
  responseType?: XMLHttpRequestResponseType;
  signal?: AbortSignal;
};

type NonBodyParams = CommonParams & {
  method: Method.Get | Method.Delete | Method.Options;
  data?: never;
};

type BodyParams = CommonParams & {
  method: Method.Put | Method.Post | Method.Patch;
  data?: any;
};

type Params = NonBodyParams | BodyParams;

export async function request({
  method,
  url,
  query,
  headers = {},
  data,
  responseType,
  signal,
}: Params): Promise<any> {
  if (query != null) {
    url = `${url}${query}`;
  }

  if (
    data != null &&
    !(data instanceof FormData) &&
    !(typeof data === 'string' && headers['Content-Type']?.startsWith('text/plain'))
  ) {
    headers['Content-Type'] = 'application/json';
    data = JSON.stringify(data);
  }

  const response = await fetch(url, { method, headers, body: data, signal });

  const contentType = response.headers.get('Content-Type');

  switch (response.status) {
    case HttpStatusCode.NetworkError:
      return Promise.reject(new Error('Network error'));
    case HttpStatusCode.Ok:
    case HttpStatusCode.Created:
    case HttpStatusCode.Accepted:
    case HttpStatusCode.PartialContent: {
      if (responseType === 'json' || contentType?.startsWith('application/json')) {
        return response.json();
      }
      if (responseType === 'arraybuffer' || contentType?.startsWith('application/octet-stream')) {
        return response.arrayBuffer();
      }
      if (responseType === 'blob' || contentType?.startsWith('application/pdf')) {
        return response.blob();
      }
      if (contentType?.startsWith('multipart/form-data')) {
        return response.formData();
      }
      return response.text();
    }
    case HttpStatusCode.NoContent:
    case HttpStatusCode.ResetContent:
      return Promise.resolve();
    case HttpStatusCode.Unauthorized:
      return Promise.reject(new Error('Unauthorized'));
    case HttpStatusCode.Conflict:
      // Response MAY have Location header with url of conflicting resource
      return Promise.reject(new Error('Conflict'));
    case HttpStatusCode.TooManyRequests:
      return Promise.reject(new Error('Too many requests'));

    default:
      return Promise.reject(new Error('Internal server error'));
  }
}
