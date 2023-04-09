# Blog

Second attempt at trying to blog. I plan to cover different topics relating to problems 
I encounter at work or any container shenanigans I do on my free time.

### Endpoints

| Stage | Endpoint | Deployment Status |
|-------|----------|-------------------|
| Alpha | [https://alpha.blog.akdev.xyz](https://alpha.blog.akdev.xyz) | Created |
| Prod | [https://blog.akdev.xyz](https://blog.akdev.xyz) | Pending |

## Build

This a static page build using `jekyll`. I am using `jekyll` from my set of containerized
CLI tools - I would recommend using that if you are interested in building these pages. (not sure why)

The process is as simple as:

```
$ cd web
$ bundle install
$ ./serve
```

## Infrastructure

This blog deployed to AWS and distrubuted globally via CloudFront with an S3 Bucket Origin.
The infrastructure is developed using AWS CDK. (also from containerized toolset)

```
$ cd infra
$ cdk deploy -c BLOG_DOMAIN=alpha.blog.akdev.xyz
```
