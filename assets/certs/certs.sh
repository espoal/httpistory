#!/bin/bash

openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out ./assets/certs/example.crt \
            -keyout ./assets/certs/example.key