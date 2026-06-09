# Rate Limiting Notes

## What is Rate Limiting?

Rate limiting is a technique used to control how many requests a client can make within a specific period of time.

Example:

```text
100 requests per minute
```

If the user exceeds the limit:

```http
429 Too Many Requests
```

is returned.

---

# Why Do We Need Rate Limiting?

Without rate limiting:

* Attackers can spam APIs.
* Login endpoints can be brute-forced.
* Servers can be overloaded.
* One user can consume excessive resources.

Rate limiting helps protect the system and ensure fair usage.

---

# Levels of Rate Limiting

## Level 1: In-Memory Fixed Window

This is where you currently are.

Architecture:

```text
Client
   |
Express Server
   |
Map/Object in Memory
```

Example:

```js
{
  "192.168.1.1": {
      count: 5,
      startTime: 1718000000000
  }
}
```

### How it works

* Count requests.
* If limit exceeded → block.
* If time window expires → reset counter.

### Pros

* Easy to understand.
* Easy to build.
* Great for learning.

### Cons

* Data disappears when server restarts.
* Doesn't work well with multiple servers.

---

## Level 2: Distributed Fixed Window (Redis)

Architecture:

```text
Client
   |
Load Balancer
   |
API Server
   |
Redis
```

Instead of storing counts in memory:

```js
Map()
```

store them in Redis.

### Why?

If you have:

```text
Server 1
Server 2
Server 3
```

all servers can share the same counter through Redis.

### Pros

* Works across multiple servers.
* Production ready for many applications.

### Cons

* Still has Fixed Window boundary problems.

---

## Level 3: Sliding Window

Instead of storing:

```js
count
startTime
```

store request timestamps.

Example:

```js
[
  12:00:10,
  12:00:15,
  12:00:30
]
```

### How it works

For every request:

1. Remove timestamps older than the window.
2. Count remaining timestamps.
3. Allow or block.

### Pros

* More accurate.
* Fairer than Fixed Window.

### Cons

* More memory usage.
* More complex.

---

## Level 4: Token Bucket / Leaky Bucket

Used in many large-scale systems.

Example:

```text
Bucket Capacity = 100
Refill Rate = 10 tokens/sec
```

Every request consumes a token.

If no tokens remain:

```http
429 Too Many Requests
```

### Pros

* Allows short bursts.
* Smooth traffic control.
* Highly scalable.

### Cons

* More complex implementation.

---

## Level 5: Production-Grade Distributed Rate Limiter

Architecture:

```text
              Load Balancer
                    |
       -------------------------
       |           |           |
      API1        API2       API3
         \          |        /
              Redis Cluster
```

Features:

* Redis
* Token Bucket
* Atomic operations
* Monitoring
* Metrics
* Different plans (Free/Premium)
* Per-user and per-IP limits

This is what companies like Google, Amazon, Uber, etc. typically discuss in system design interviews.

---

# What Level Am I Currently At?

You built:

```js
const requests = new Map();
```

and stored:

```js
count
startTime
```

for every IP.

That means:

✅ In-Memory

✅ Fixed Window

Therefore:

```text
Current Level = Level 1
```

This is exactly where every backend developer should start.

---

# Fixed Window Logic (Your Current Implementation)

For every request:

```text
Request Arrives
      ↓
First Request?
      ↓
Create Entry
      ↓
Check if Window Expired
      ↓
Yes → Reset Counter
      ↓
No → Continue
      ↓
Limit Reached?
      ↓
Yes → 429
      ↓
No → Increase Count
      ↓
Allow Request
```

---

# Where Should We Apply Rate Limiting?

There are two common approaches.

---

## 1. Rate Limiting by IP (Server/Machine Level)

Example:

```js
const ip = req.ip;
```

### Use Cases

Before authentication:

```text
POST /login
POST /signup
POST /forgot-password
```

### Why?

At this stage:

```text
No user is logged in.
```

The only thing we know is:

```text
The request came from this IP address.
```

This helps stop:

* Brute-force attacks
* Bot attacks
* Spam requests

### Example

```text
5 login attempts/minute/IP
```

---

## 2. Rate Limiting by User ID

Example:

```js
const userId = req.user.id;
```

### Use Cases

After authentication:

```text
POST /message
POST /comment
POST /upload
```

### Why?

Now we know exactly who the user is.

We want:

```text
User A → 100 requests
User B → 100 requests
User C → 100 requests
```

instead of everyone sharing the same IP quota.

### Example

```text
100 messages/minute/user
```

---

# Which One Is Better?

Neither.

Production systems often use both.

---

## Before Login

Use IP-based limits.

```text
POST /login
POST /signup
```

Reason:

```text
No authenticated user exists yet.
```

---

## After Login

Use User-based limits.

```text
POST /message
POST /comment
```

Reason:

```text
We want to control individual users.
```

---

# Example: Chat Application

### Login Endpoint

```text
POST /login
```

Rate Limit:

```text
5 requests/minute/IP
```

Purpose:

```text
Prevent password guessing attacks.
```

---

### Message Endpoint

```text
POST /message
```

Rate Limit:

```text
100 requests/minute/user
```

Purpose:

```text
Prevent message spam.
```

---

# Final Interview Answer

If an interviewer asks:

> What level are you at currently?

Answer:

> I have implemented an in-memory Fixed Window Rate Limiter using a JavaScript Map. It tracks request count and window start time per IP. It is suitable for learning and single-server applications, but for production systems I would move to Redis and eventually use Sliding Window or Token Bucket algorithms.

That's a strong junior-to-mid-level backend answer.
