#!/bin/bash

(
    cd ../web
    bundle exec jekyll build
    cp -rva _site ../infra/_site
    bundle exec jekyll clean
)
