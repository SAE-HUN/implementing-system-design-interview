## Architecture
![Untitled Diagram drawio (1)](https://user-images.githubusercontent.com/59135804/209544236-fa0d7cfa-4c1d-4eb3-b098-56880a5ec0b3.png)

## Prerequisites

### Install Node.js

```=bash
brew install node
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
   PROXY_PORT=
   ```
4. Start rate limiter
   ```=bash
   node index.js
   ```
5. Visit `http://localhost.com:{port}/{key}`

## Test
{Node ID}: {Counts}
- Number of nodes: 30
- Number of replica: 1000
```
'0': 27,
'1': 9,
'2': 17,
'3': 6,
'4': 20,
'5': 14,
'6': 13,
'7': 10,
'8': 16,
'9': 16,
'10': 18,
'11': 13,
'12': 9,
'13': 14,
'14': 10,
'15': 13,
'16': 11,
'17': 18,
'18': 11,
'19': 10,
'20': 16,
'21': 8,
'22': 14,
'23': 15,
'24': 12,
'25': 13,
'26': 10,
'27': 9,
'28': 17,
'29': 11
```
## References

- [그대안의 작은 호수: 5줄로 된 구글의 CONSISTENT HASHING](https://smallake.kr/?p=17730)
- [dev-log: 안정 해시 (Consistent hashing)](https://velog.io/@dev-log/%EC%95%88%EC%A0%95-%ED%95%B4%EC%8B%9C-%EC%84%A4%EA%B3%84Consistent-hashing)
- [조아하는 모든 것: Consistent Hashing (일관된 해싱)](https://uiandwe.tistory.com/1325)
- [charsyam: Memcached 에서의 Consistent Hashing](https://charsyam.wordpress.com/2011/11/25/memcached-%EC%97%90%EC%84%9C%EC%9D%98-consistent-hashing/)
- [Mimul: Consistent Hashing 소개](https://www.mimul.com/blog/consistent-hashing/)
