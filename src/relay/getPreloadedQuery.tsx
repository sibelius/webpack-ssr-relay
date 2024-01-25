import type { ConcreteRequest, Variables } from 'relay-runtime';

export const getRequestEsm = (request: ConcreteRequest) => {
  if (request.default) {
    return request.default;
  }

  return request;
};

export async function getPreloadedQuery(
  environment,
  request: ConcreteRequest,
  variables: Variables,
) {
  const safeRequest = getRequestEsm(request);

  // const response = await networkFetch(safeRequest.params, variables);
  // get request from cache
  const response = await environment.getNetwork().fetchResponse(safeRequest.params, variables);

  return {
    params: safeRequest.params,
    variables,
    response,
  };
}
