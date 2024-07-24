import {createGatewayOnNodeRuntime} from "@lobehub/chat-plugins-gateway";

export const config = {
    runtime: 'edge',
};

const fun = async (req: Request, res: Response) => {
  console.log('in gateway', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    const { createGatewayOnEdgeRuntime } = await import('@lobehub/chat-plugins-gateway');

    return createGatewayOnEdgeRuntime()(req);
  }

  return createGatewayOnNodeRuntime()(req, res);
};

export default fun