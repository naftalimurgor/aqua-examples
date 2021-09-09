/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.3.0-222
 *
 */
import { FluencePeer } from "@fluencelabs/fluence";
import {
  ResultCodes,
  RequestFlow,
  RequestFlowBuilder,
  CallParams,
} from "@fluencelabs/fluence/dist/internal/compilerSupport/v1";

// Services

export interface HelloWorldDef {
  hello: (str: string, callParams: CallParams<"str">) => void;
}

export function registerHelloWorld(service: HelloWorldDef): void;
export function registerHelloWorld(
  serviceId: string,
  service: HelloWorldDef
): void;
export function registerHelloWorld(
  peer: FluencePeer,
  service: HelloWorldDef
): void;
export function registerHelloWorld(
  peer: FluencePeer,
  serviceId: string,
  service: HelloWorldDef
): void;
export function registerHelloWorld(...args) {
  let peer: FluencePeer;
  let serviceId;
  let service;
  if (FluencePeer.isInstance(args[0])) {
    peer = args[0];
  } else {
    peer = FluencePeer.default;
  }

  if (typeof args[0] === "string") {
    serviceId = args[0];
  } else if (typeof args[1] === "string") {
    serviceId = args[1];
  } else {
    serviceId = "hello-world";
  }

  if (!FluencePeer.isInstance(args[0]) && typeof args[0] === "object") {
    service = args[0];
  } else if (typeof args[1] === "object") {
    service = args[1];
  } else {
    service = args[2];
  }

  peer.internals.callServiceHandler.use((req, resp, next) => {
    if (req.serviceId !== serviceId) {
      next();
      return;
    }

    if (req.fnName === "hello") {
      const callParams = {
        ...req.particleContext,
        tetraplets: {
          str: req.tetraplets[0],
        },
      };
      resp.retCode = ResultCodes.success;
      service.hello(req.args[0], callParams);
      resp.result = {};
    }

    next();
  });
}

// Functions

export function sayHello(config?: { ttl?: number }): Promise<void>;
export function sayHello(
  peer: FluencePeer,
  config?: { ttl?: number }
): Promise<void>;
export function sayHello(...args) {
  let peer: FluencePeer;

  let config;
  if (FluencePeer.isInstance(args[0])) {
    peer = args[0];
    config = args[1];
  } else {
    peer = FluencePeer.default;
    config = args[0];
  }

  let request: RequestFlow;
  const promise = new Promise<void>((resolve, reject) => {
    const r = new RequestFlowBuilder()
      .disableInjections()
      .withRawScript(
        `
     (xor
 (seq
  (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
  (call %init_peer_id% ("hello-world" "hello") ["Hello, world!"])
 )
 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
)

                 `
      )
      .configHandler((h) => {
        h.on("getDataSrv", "-relay-", () => {
          return peer.connectionInfo.connectedRelay;
        });

        h.onEvent("callbackSrv", "response", (args) => {});

        h.onEvent("errorHandlingSrv", "error", (args) => {
          const [err] = args;
          reject(err);
        });
      })
      .handleScriptError(reject)
      .handleTimeout(() => {
        reject("Request timed out for sayHello");
      });
    if (config && config.ttl) {
      r.withTTL(config.ttl);
    }
    request = r.build();
  });
  peer.internals.initiateFlow(request!);
  return Promise.race([promise, Promise.resolve()]);
}
