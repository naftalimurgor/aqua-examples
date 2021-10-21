/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.4.0-234
 *
 */
import { Fluence, FluencePeer } from "@fluencelabs/fluence";
import {
  CallParams,
  callFunction,
  registerService,
} from "@fluencelabs/fluence/dist/internal/compilerSupport/v2";

// Services

export interface HelloWorldDef {
  hello: (
    from: string,
    callParams: CallParams<"from">
  ) => { msg: string; reply: string } | Promise<{ msg: string; reply: string }>;
}
export function registerHelloWorld(
  serviceId: string,
  service: HelloWorldDef
): void;
export function registerHelloWorld(
  peer: FluencePeer,
  serviceId: string,
  service: HelloWorldDef
): void;

export function registerHelloWorld(...args: any) {
  registerService(args, {
    defaultServiceId: undefined,
    functions: [
      {
        functionName: "hello",
        argDefs: [
          {
            name: "from",
            argType: {
              tag: "primitive",
            },
          },
        ],
        returnType: {
          tag: "primitive",
        },
      },
    ],
  });
}

export interface HelloPeerDef {
  hello: (
    message: string,
    callParams: CallParams<"message">
  ) => string | Promise<string>;
}
export function registerHelloPeer(service: HelloPeerDef): void;
export function registerHelloPeer(
  serviceId: string,
  service: HelloPeerDef
): void;
export function registerHelloPeer(
  peer: FluencePeer,
  service: HelloPeerDef
): void;
export function registerHelloPeer(
  peer: FluencePeer,
  serviceId: string,
  service: HelloPeerDef
): void;

export function registerHelloPeer(...args: any) {
  registerService(args, {
    defaultServiceId: "HelloPeer",
    functions: [
      {
        functionName: "hello",
        argDefs: [
          {
            name: "message",
            argType: {
              tag: "primitive",
            },
          },
        ],
        returnType: {
          tag: "primitive",
        },
      },
    ],
  });
}

// Functions

export function sayHello(
  targetPeerId: string,
  targetRelayPeerId: string,
  config?: { ttl?: number }
): Promise<string>;
export function sayHello(
  peer: FluencePeer,
  targetPeerId: string,
  targetRelayPeerId: string,
  config?: { ttl?: number }
): Promise<string>;
export function sayHello(...args: any) {
  let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "targetPeerId") [] targetPeerId)
                           )
                           (call %init_peer_id% ("getDataSrv" "targetRelayPeerId") [] targetRelayPeerId)
                          )
                          (call -relay- ("op" "noop") [])
                         )
                         (xor
                          (seq
                           (call -relay- ("op" "noop") [])
                           (call "12D3KooWFEwNWcHqi9rtsmDhsYcDbRUCDXH84RC4FW6UfsFWaoHi" ("1e740ce4-81f6-4dd4-9bed-8d86e9c2fa50" "hello") [%init_peer_id%] comp)
                          )
                          (seq
                           (call -relay- ("op" "noop") [])
                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                          )
                         )
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (par
                        (seq
                         (call targetRelayPeerId ("op" "noop") [])
                         (xor
                          (call targetPeerId ("HelloPeer" "hello") [%init_peer_id%] res)
                          (seq
                           (seq
                            (call targetRelayPeerId ("op" "noop") [])
                            (call -relay- ("op" "noop") [])
                           )
                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                          )
                         )
                        )
                        (null)
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [comp.$.reply!])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `;
  return callFunction(
    args,
    {
      functionName: "sayHello",
      returnType: {
        tag: "primitive",
      },
      argDefs: [
        {
          name: "targetPeerId",
          argType: {
            tag: "primitive",
          },
        },
        {
          name: "targetRelayPeerId",
          argType: {
            tag: "primitive",
          },
        },
      ],
      names: {
        relay: "-relay-",
        getDataSrv: "getDataSrv",
        callbackSrv: "callbackSrv",
        responseSrv: "callbackSrv",
        responseFnName: "response",
        errorHandlingSrv: "errorHandlingSrv",
        errorFnName: "error",
      },
    },
    script
  );
}
