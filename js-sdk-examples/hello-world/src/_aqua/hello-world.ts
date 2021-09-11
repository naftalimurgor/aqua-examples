/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/. 
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.3.0-226
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    ResultCodes,
    RequestFlow,
    RequestFlowBuilder,
    CallParams,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v1';


// Services

 export interface HelloWorldDef {
     hello: (str: string, callParams: CallParams<'str'>) => void;
 }

 export function registerHelloWorld(service: HelloWorldDef): void;
export function registerHelloWorld(serviceId: string, service: HelloWorldDef): void;
export function registerHelloWorld(peer: FluencePeer, service: HelloWorldDef): void;
export function registerHelloWorld(peer: FluencePeer, serviceId: string, service: HelloWorldDef): void;
 export function registerHelloWorld(...args: any) {
    let peer: FluencePeer;
    let serviceId: any;
    let service: any;
    if (FluencePeer.isInstance(args[0])) {
        peer = args[0];
    } else {
        peer = Fluence.getPeer();
    }

    if (typeof args[0] === 'string') {
        serviceId = args[0];
    } else if (typeof args[1] === 'string') {
        serviceId = args[1];
    }  
 else {
     serviceId = "hello-world"
}

    // Figuring out which overload is the service.
    // If the first argument is not Fluence Peer and it is an object, then it can only be the service def
    // If the first argument is peer, we are checking further. The second argument might either be
    // an object, that it must be the service object
    // or a string, which is the service id. In that case the service is the third argument
    if (!(FluencePeer.isInstance(args[0])) && typeof args[0] === 'object') {
        service = args[0];
    } else if (typeof args[1] === 'object') {
        service = args[1];
    } else {
        service = args[2];
    }

      peer.internals.callServiceHandler.use((req, resp, next) => {
          if (req.serviceId !== serviceId) {
              next();
              return;
          }
  
          
 if (req.fnName === 'hello') {
     
 const callParams = {
     ...req.particleContext,
     tetraplets: {
         str: req.tetraplets[0]
     },
 };
 resp.retCode = ResultCodes.success;
 service.hello(req.args[0], callParams); resp.result = {}

 }
    
  
          next();
      });
 }
      

// Functions

 export function sayHello(config?: {ttl?: number}) : Promise<void>;
 export function sayHello(peer: FluencePeer, config?: {ttl?: number}) : Promise<void>;
 export function sayHello(...args: any) {
     let peer: FluencePeer;
     
     let config: any;
     if (FluencePeer.isInstance(args[0])) {
         peer = args[0];
         config = args[1];
     } else {
         peer = Fluence.getPeer();
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

                 `,
                 )
                 .configHandler((h) => {
                     h.on('getDataSrv', '-relay-', () => {
                    return peer.getStatus().relayPeerId;
                });
                
                h.onEvent('callbackSrv', 'response', (args) => {
  
});

                h.onEvent('errorHandlingSrv', 'error', (args) => {
                    const [err] = args;
                    reject(err);
                });
            })
            .handleScriptError(reject)
            .handleTimeout(() => {
                reject('Request timed out for sayHello');
            })
        if(config && config.ttl) {
            r.withTTL(config.ttl)
        }
        request = r.build();
    });
    peer.internals.initiateFlow(request!);
    return Promise.race([promise, Promise.resolve()]);
}
      


 export function getRelayTime(config?: {ttl?: number}) : Promise<number>;
 export function getRelayTime(peer: FluencePeer, config?: {ttl?: number}) : Promise<number>;
 export function getRelayTime(...args: any) {
     let peer: FluencePeer;
     
     let config: any;
     if (FluencePeer.isInstance(args[0])) {
         peer = args[0];
         config = args[1];
     } else {
         peer = Fluence.getPeer();
         config = args[0];
     }
    
     let request: RequestFlow;
     const promise = new Promise<number>((resolve, reject) => {
         const r = new RequestFlowBuilder()
                 .disableInjections()
                 .withRawScript(
                     `
     (xor
 (seq
  (seq
   (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
   (xor
    (call -relay- ("peer" "timestamp_ms") [] ts)
    (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
   )
  )
  (xor
   (call %init_peer_id% ("callbackSrv" "response") [ts])
   (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
  )
 )
 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
)

                 `,
                 )
                 .configHandler((h) => {
                     h.on('getDataSrv', '-relay-', () => {
                    return peer.getStatus().relayPeerId;
                });
                
                h.onEvent('callbackSrv', 'response', (args) => {
    const [res] = args;
  resolve(res);
});

                h.onEvent('errorHandlingSrv', 'error', (args) => {
                    const [err] = args;
                    reject(err);
                });
            })
            .handleScriptError(reject)
            .handleTimeout(() => {
                reject('Request timed out for getRelayTime');
            })
        if(config && config.ttl) {
            r.withTTL(config.ttl)
        }
        request = r.build();
    });
    peer.internals.initiateFlow(request!);
    return promise;
}
      
