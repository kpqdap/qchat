gracefulShutdown() {
    echo "Received signal to stop, gracefully shutting down..."
    exit 0
}

trap 'gracefulShutdown' SIGTERM SIGINT

node server.js &

wait $!
