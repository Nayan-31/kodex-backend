# Understanding Rate Limiting

## How Requests Flow Through a Rate Limiter

When we write:

```js
app.use(rateLimiter);
```

it means **every incoming HTTP request** passes through the middleware.

Imagine your frontend has a button:

```jsx
<button onClick={sendMessage}>
  Send
</button>
```

When the user clicks it:

```js
axios.post("/api/message");
```

that's **one request**.

If they click again:

```js
axios.post("/api/message");
```

that's **another request**.

---

## Example Timeline

### User opens the chat app

### Request #1

```http
GET /api/chats
```

Rate limiter runs:

```js
{
  count: 1
}
```

---

### Request #2

User sends a message.

```http
POST /api/message
```

Rate limiter runs again:

```js
{
  count: 2
}
```

---

### Request #3

User refreshes the page.

```http
GET /api/chats
```

Rate limiter runs again:

```js
{
  count: 3
}
```

---

### Request #4

User sends another message.

```http
POST /api/message
```

Rate limiter runs again:

```js
{
  count: 4
}
```

---

## What Actually Happens?

The user doesn't tell the rate limiter:

> "This is my second request."

The server automatically sees every request:

```text
New HTTP Request Arrived
       ↓
Run Middleware
       ↓
Check Count
       ↓
Allow or Block
```

This happens for every request.

---

## Security Guard Analogy

Think of a security guard at a mall:

```text
Person enters → count = 1
Person enters → count = 2
Person enters → count = 3
```

The guard doesn't need the person to announce:

> "Hi, this is my second visit."

The guard simply sees them enter every time.

Similarly, Express sees:

```http
GET /users
POST /login
GET /profile
POST /message
```

and the middleware executes for each request.

---

## Testing with Postman

Hit the same endpoint repeatedly:

```http
GET localhost:3000/test
```

Results:

```text
1st request  → count = 1 ✅
2nd request  → count = 2 ✅
3rd request  → count = 3 ✅
...
11th request → 429 ❌
```

Watching this happen in Postman is usually when rate limiting really clicks.

---

# Is 10 Requests Too Low?

Yes.

The value 10 is only used as a learning example.

In a real application, 10 requests per minute would be far too restrictive.

---

## Example: Chat Application

When a user opens the app:

```http
GET /chats
GET /notifications
GET /profile
GET /groups
```

Already:

```text
4 requests
```

Then they:

```text
Send a message
Fetch new messages
Mark a message as read
```

Now you're already at:

```text
7+ requests
```

A normal user can easily generate dozens or hundreds of requests within a few minutes.

---

## Real-World Rate Limits

### Login Endpoint

```http
POST /login
```

Limit:

```text
5 requests/minute
```

Reason:

```text
Prevent brute-force attacks.
```

---

### Message Endpoint

```http
POST /message
```

Limit:

```text
100 requests/minute
```

Reason:

```text
Normal users send messages frequently.
```

---

### Public APIs

Some companies allow:

```text
1000 requests/minute
```

or even:

```text
100 requests/second
```

depending on the service.

---

# One Global Rate Limiter Is Usually Bad

Avoid:

```js
app.use(rateLimiter);
```

with:

```text
10 requests/minute
```

for the entire application.

---

## Better Approach

```js
app.use("/login", loginLimiter);
app.use("/signup", signupLimiter);
app.use("/message", messageLimiter);
```

Example limits:

### Login

```text
5 requests/minute
```

### Messages

```text
100 requests/minute
```

### Search

```text
30 requests/minute
```

---

# The Real Challenge

The difficult part isn't counting requests.

The difficult part is deciding:

> What should the limit be for this endpoint?

That's a system-design problem.

```text
Too low  → Users get annoyed
Too high → Attackers can abuse the system
```

Companies typically monitor traffic and tune limits over time.

---

# What Happens If We Don't Reset the Window?

Consider this important piece of code:

```js
if (Date.now() - userData.startTime > WINDOW_MS) {
    requests.set(ip, {
        count: 1,
        startTime: Date.now()
    });

    return next();
}
```

---

## Example

Suppose:

```js
MAX_REQUESTS = 10;
WINDOW_MS = 60 * 1000;
```

At:

```text
12:00:00
```

The user makes 10 requests.

Stored data:

```js
{
  "192.168.1.1": {
    count: 10,
    startTime: "12:00:00"
  }
}
```

---

### Request #11

Check:

```js
if (count >= 10)
```

Result:

```text
true
```

Response:

```http
429 Too Many Requests
```

---

## One Minute Later

Current time:

```text
12:01:00
```

User sends another request.

If we remove:

```js
if (Date.now() - userData.startTime > WINDOW_MS)
```

then data remains:

```js
{
  count: 10,
  startTime: "12:00:00"
}
```

Count never resets.

---

Check again:

```js
if (count >= 10)
```

Result:

```text
true
```

User gets:

```http
429 Too Many Requests
```

again.

---

## Another Minute Later

```text
12:02:00
```

Still:

```js
{
  count: 10,
  startTime: "12:00:00"
}
```

Still blocked.

---

## One Hour Later

Still blocked.

---

## One Day Later

Still blocked.

---

## Forever

Still blocked.

---

# Why Step 6 Matters

Step 6 is asking:

> Has the punishment period ended?

If yes:

```js
count = 1;
startTime = Date.now();
```

The user gets a fresh chance.

---

## Traffic Signal Analogy

```text
Red Light = Blocked
Timer Ends = Turn Green
```

Without the timer:

```text
Red Light Forever
```

---

# Key Takeaway

A rate limiter must do three things:

1. Track requests.
2. Detect when the time window expires.
3. Reset the counter.

Without resetting the counter, it's not:

```text
10 requests per minute
```

It's:

```text
10 requests for your entire lifetime 😄
```
