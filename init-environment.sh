# Initializes environment variables necessary for running
# tests against docker containers.

alias echoerr=">&2 echo"

# set up trap so that script can be exited from within functions
trap "exit 1" TERM
main_pid=$$

lookup_service_port() {
    service=$1
    port=$2
    port_mapping_output=$(docker-compose -f docker-compose.yml port $service $port)
    if [ $? -ne 0 ]; then
        echoerr "$service container not running. Exiting early."
        kill -s TERM $main_pid
    fi
    echo "$port_mapping_output" | sed 's/.*:\([0-9][0-9]*\)$/\1/'
}

export AMQ_PORT=$(lookup_service_port rabbitmq 5672)
export POSTGRES_PORT=$(lookup_service_port postgres 5432)

echo "AMQ_PORT: $AMQ_PORT"
echo "POSTGRES_PORT: $POSTGRES_PORT"