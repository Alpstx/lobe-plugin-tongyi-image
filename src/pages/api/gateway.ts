export const config = {
    runtime: 'edge',
};

const fun = async (req: Request) => {
  console.log('in gateway', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    const { createGatewayOnEdgeRuntime } = await import('@lobehub/chat-plugins-gateway');

    return createGatewayOnEdgeRuntime()(req);
  }

  return new Response('gateway');
};

export default fun