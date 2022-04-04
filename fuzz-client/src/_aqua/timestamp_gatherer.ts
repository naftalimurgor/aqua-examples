/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.7.1-293
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v3';


// Services

// Functions
 
export type Collect_timestamps_from_neighborhoodResult = [number[], string[]]
export function collect_timestamps_from_neighborhood(
    config?: {ttl?: number}
): Promise<Collect_timestamps_from_neighborhoodResult>;

export function collect_timestamps_from_neighborhood(
    peer: FluencePeer,
    config?: {ttl?: number}
): Promise<Collect_timestamps_from_neighborhoodResult>;

export function collect_timestamps_from_neighborhood(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (new $statuses
                        (new $timestamps
                         (seq
                          (new $dead_peers
                           (seq
                            (xor
                             (seq
                              (seq
                               (seq
                                (seq
                                 (seq
                                  (call -relay- ("op" "string_to_b58") [-relay-] k)
                                  (call -relay- ("kad" "neighborhood") [k [] []] nodes)
                                 )
                                 (par
                                  (fold nodes n
                                   (par
                                    (new $status
                                     (seq
                                      (seq
                                       (seq
                                        (par
                                         (xor
                                          (seq
                                           (call n ("peer" "timestamp_ms") [] $timestamps)
                                           (ap "ok" $status)
                                          )
                                          (seq
                                           (call -relay- ("op" "noop") [])
                                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                          )
                                         )
                                         (call -relay- ("peer" "timeout") [2000 "timed out"] $status)
                                        )
                                        (call -relay- ("op" "identity") [$status.$.[0]!] push-to-stream-30)
                                       )
                                       (ap push-to-stream-30 $statuses)
                                      )
                                      (xor
                                       (mismatch $status.$.[0]! "ok"
                                        (ap n $dead_peers)
                                       )
                                       (null)
                                      )
                                     )
                                    )
                                    (next n)
                                   )
                                  )
                                  (null)
                                 )
                                )
                                (call -relay- ("op" "array_length") [nodes] length)
                               )
                               (call -relay- ("math" "sub") [length 1] sub)
                              )
                              (call -relay- ("op" "noop") [$statuses.$.[sub]!])
                             )
                             (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                            )
                            (call %init_peer_id% ("op" "identity") [$dead_peers] dead_peers-fix)
                           )
                          )
                          (call %init_peer_id% ("op" "identity") [$timestamps] timestamps-fix)
                         )
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [timestamps-fix dead_peers-fix])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "collect_timestamps_from_neighborhood",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "array",
                    "type" : {
                        "tag" : "scalar",
                        "name" : "u64"
                    }
                },
                {
                    "tag" : "array",
                    "type" : {
                        "tag" : "scalar",
                        "name" : "string"
                    }
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
