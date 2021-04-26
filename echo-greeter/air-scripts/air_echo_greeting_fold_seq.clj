(xor
    (seq
        (seq
            (call relay ("op" "identity") [])
            (call node_1 (echo_service "echo") [names]  array_result)
        )
        (seq
            (seq
                (call relay ("op" "identity") [])
                (call %init_peer_id% (returnService "run") [array_result])
            )
            (seq
                (fold array_result item
                    (seq
                        (seq
                            (call relay ("op" "identity") [])
                            (call node_2 (greeting_service_1 "greeting") [item.$.["echo"]! greeter] $greeter_results)
                        )
                        (seq
                            (call relay ("op" "identity") [])
                            (next item)
                        )
                    )
                )
                (seq
                    (call relay ("op" "identity") [])
                    (call %init_peer_id% ("returnService" "run") [$greeter_results])
                )
            )
        )
    )
    (seq
        (call relay ("op" "identity") [])
        (call %init_peer_id% (returnService "run") ["XOR FAILED" %last_error%])
    )
)
