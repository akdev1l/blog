FROM fedora:latest

RUN dnf install -y \
        nodejs \
        @development-tools \
        'gcc-c++' \
        'libstdc++-devel' \
        git \
        make \
        rubygems \
        ruby-devel \
        rubygem-eventmachine \
        rubygem-jekyll \
        rubygem-racc \
        rubygem-unf \
        rubygem-unf_ext && \
    bundle config set --local path 'vendor/bundle'

        
        
