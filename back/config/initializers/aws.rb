require 'aws-sdk-s3'

Aws.config.update({
  region: "auto",
  credentials: Aws::Credentials.new(ENV['cloudflare_key_id'], ENV['secret_access_key']),
})

S3_BUCKET = Aws::S3::Resource.new.bucket(ENV['bucket'])