#!/bin/bash

(
    cd ../web
    bundle exec jekyll build
    cp -rva _site ../infra/_site
    bundle exec jekyll clean
)

cdk synth -c BLOG_DOMAIN=alpha.blog.akdev.xyz
cdk deploy -c BLOG_DOMAIN=alpha.blog.akdev.xyz
