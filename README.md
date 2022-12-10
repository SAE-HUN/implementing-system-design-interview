## Architecture

![untitled (1)](https://user-images.githubusercontent.com/59135804/206873270-93eb769a-1e55-48c8-9411-57601c80c0bf.png)

## Prerequisites

### Install Node.js

```=bash
brew install node
```

### Install Redis

```=bash
# Pull redis docker image
docker image pull redis
# Run redis
docker run -d --name redis -p 6379:6379
```

### Set limit rate configuration

```=bash
# Access to redis container
docker exec -it redis /bin/bash
# Access to redis
redis-cli

# Set limit rate configuration
set LIMIT_RULE:REQUIRED_API_CREDITS:{method} {value}
set LIMIT_RULE:{token}:API_CREDITS_PER_MONTH {value}
set LIMIT_RULE:{token}:REQUESTS_PER_SEC {value}
set LIMIT_RULE:{token}:REQUESTS_BUCKET_SIZE {value}

# Set limit rate state for personal token
set API_CREDITS:{token}:LAST_CHECK_TIME {value}
set API_CREDITS:{token}:COUNTER {value}
set REQUESTS:{token}:LAST_CHECK_TIME {value}
set REQUESTS:{token}:TOKENS_IN_BUCKET {value}
```

## Installation

1. Clone the repo
   ```=bash
   git clone https://github.com/SAE-HUN/implementing-system-design-interview.git
   ```
2. Install NPM packages
   ```=bash
   npm install
   ```
3. Enter your envirionments in `.env`
   ```
   PORT_APP=
   PORT_REDIS=
   URL_REDIS=
   ```
4. Start rate limiter
   ```=bash
   node index.js
   ```
5. Visit `http://localhost.com:{port}/{token}/{method}`

## Test

<img width="1716" alt="Screen Shot 2022-12-11 at 4 10 49 AM" src="https://user-images.githubusercontent.com/59135804/206871704-32046c0b-c96a-440f-be18-c2315f9c3cbb.png">

![Untitled](https://user-images.githubusercontent.com/59135804/206871676-3499ce75-6c20-4a51-a716-22bf510a332d.png)

## Improvements

- Rate limiter can retrieve limit rule(such as rps) without cache server
  - Token maker should make token which include limit rule information, encrypted by secret key
  - Rate limiter can retrieve limit rule information about token using secret key

## References

- https://donghyeon.dev/인프라/2022/03/18/처리율-제한-장치의-설계/
- https://dev.to/satrobit/rate-limiting-using-the-token-bucket-algorithm-3cjh
- https://dev.to/satrobit/rate-limiting-using-the-fixed-window-algorithm-2hgm
- https://www.quicknode.com/pricing
