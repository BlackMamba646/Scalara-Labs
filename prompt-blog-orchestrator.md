# Blog Content Orchestrator

You are an orchestrator agent. Your job is to coordinate the generation and upload of full article content for all blog posts in the Scalara Labs CMS.

---

## Step 1: Read environment variables

Read the `.env` file in this project root to get:
- `CMS_URL` — the Strapi base URL
- `CMS_API` — the Bearer token for authentication

---

## Step 2: Fetch all blog posts from the CMS

Make a GET request to:

```
GET {CMS_URL}/api/blog-posts?populate=*&sort=date:asc
```

With header: `Authorization: Bearer {CMS_API}`

From the response, extract each blog post's:
- `title`
- `slug`
- `documentId`
- `content` (to check if it already has a full article)

---

## Step 3: Identify blog posts that need content

A blog post needs content if its `content` field is either:
- null/empty, OR
- Identical (or nearly identical) to its `excerpt` field — this means it only has placeholder text, not a real article

All 9 posts currently have placeholder content that just repeats the excerpt. All 9 need full articles generated.

Log the list of posts that need content, showing each title and documentId.

---

## Step 4: Spawn one sub-agent per blog post, all in parallel

For each blog post that needs content, spawn a background sub-agent using the Agent tool with `run_in_background: true`.

**All sub-agents must be spawned in a single message** (one message with multiple Agent tool calls) so they run in parallel.

Each sub-agent's prompt must contain everything it needs to work independently. Use the following template, filling in the blog-specific values:

```
You are a copywriter and CMS integration agent for Scalara Labs. Your task is to write a full blog article for ONE specific post and upload it to the Strapi CMS.

## Your assigned blog post

- **Title:** {title}
- **Slug:** {slug}
- **Document ID:** {documentId}
- **Date:** {date}

## Instructions

1. Read the file `prompt-blog-content.md` in the project root. It contains:
   - Company context (Section 1)
   - Brand voice guidelines (Section 2)
   - Content guidelines with article structure, length, and formatting rules (Section 3)
   - CMS field schema (Section 4)
   - Context and angle for your specific blog post (Section 5, subsection for "{title}")
   - CMS upload instructions (Section 6)
   - Quality constraints (Section 7)

2. Read the `.env` file to get `CMS_URL` and `CMS_API`.

3. Following the guidelines from the prompt file, generate:
   - `excerpt` — 1–2 sentence summary for listing cards (NOT the first paragraph of the article)
   - `content` — Full article body, 800–1000 words. Plain text only, paragraphs separated by \n\n. No markdown, no HTML, no headings.
   - `seo` — object with `metaTitle` and `metaDescription`

4. Upload with a PUT request:
   - Endpoint: PUT {CMS_URL}/api/blog-posts/{documentId}
   - Headers: Authorization: Bearer {CMS_API}, Content-Type: application/json
   - Body: { "data": { "excerpt": "...", "content": "...", "seo": { "metaTitle": "...", "metaDescription": "..." } } }
   - Do NOT include title, slug, author, or date in the body.

5. Verify the response contains "data" (not "error"). If it fails, try once more. Report whether the upload succeeded or failed.
```

Replace the placeholders (`{title}`, `{slug}`, `{documentId}`, `{date}`) with the actual values from Step 2 for each blog post.

---

## Step 5: Wait for all sub-agents to complete

You will receive notifications as each background sub-agent finishes. Wait until ALL sub-agents have reported back. Do not proceed to verification until every one has completed.

As each agent finishes, log its result (success or failure + blog title).

---

## Step 6: Final verification

Once all sub-agents have completed, make a verification GET request:

```
GET {CMS_URL}/api/blog-posts?populate=*&sort=date:asc
```

For each blog post, verify:
- `content` is a non-empty string significantly longer than the `excerpt` (at least 3000 characters, which roughly corresponds to 800+ words)
- `excerpt` is a non-empty string that differs from the first paragraph of `content`
- `seo` is non-null with both `metaTitle` and `metaDescription` populated

---

## Step 7: Report results

Present a summary table to the user:

| Blog Post | Status | Word Count | Notes |
|---|---|---|---|
| The Pitfalls of Overengineering | Success / Failed | ~N words | Any issues |
| Effective User Testing Strategies | Success / Failed | ~N words | Any issues |
| ... | ... | ... | ... |

Estimate word count by splitting `content` on whitespace and counting.

If any posts failed, list them clearly so the user can address them manually.
