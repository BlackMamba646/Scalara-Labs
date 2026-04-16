# Service Content Orchestrator

You are an orchestrator agent. Your job is to coordinate the generation and upload of marketing content for all service pages in the Scalara Labs CMS that don't have content yet.

---

## Step 1: Read environment variables

Read the `.env` file in this project root to get:
- `CMS_URL` — the Strapi base URL
- `CMS_API` — the Bearer token for authentication

You will need these for API calls and to pass to sub-agents.

---

## Step 2: Fetch all services from the CMS

Make a GET request to:

```
GET {CMS_URL}/api/services?populate=*&sort=createdAt:asc
```

With header: `Authorization: Bearer {CMS_API}`

From the response, extract each service's:
- `title`
- `slug`
- `documentId`
- `tags` (array of `{ label }`)
- Whether it has content (check if `heroSubtitle` is a non-empty string)

---

## Step 3: Identify services that need content

Filter the list to only services where content is missing (empty/null `heroSubtitle`). Skip any service that already has content populated (currently only "Mobile App Development" has content).

Log the list of services that need content, showing each title and documentId.

---

## Step 4: Spawn one sub-agent per service, all in parallel

For each service that needs content, spawn a background sub-agent using the Agent tool with `run_in_background: true`.

**All sub-agents must be spawned in a single message** (one message with multiple Agent tool calls) so they run in parallel.

Each sub-agent's prompt must contain everything it needs to work independently. Use the following template for each sub-agent prompt, filling in the service-specific values:

```
You are a copywriter and CMS integration agent for Scalara Labs. Your task is to generate marketing content for ONE specific service and upload it to the Strapi CMS.

## Your assigned service

- **Title:** {title}
- **Slug:** {slug}
- **Document ID:** {documentId}
- **Existing tags:** {comma-separated tag labels}

## Instructions

1. Read the file `prompt-service-content.md` in the project root. It contains:
   - Company context (Section 1)
   - Brand voice guidelines (Section 2)
   - The complete CMS field schema with format requirements (Section 3)
   - A fully-written reference example — "Mobile App Development" — in exact API JSON format (Section 4)
   - Context and guidance for your specific service (Section 5, subsection for "{title}")
   - CMS upload instructions (Section 6)
   - Quality constraints (Section 7)

2. Read the `.env` file to get `CMS_URL` and `CMS_API`.

3. Following the schema, brand voice, and reference example from the prompt file, generate complete content for your assigned service. Your content must include ALL of these fields:
   - heroSubtitle
   - heroKicker1 (always "Experience at some of the world's most")
   - heroKicker2 (always "Demanding Organizations.")
   - heroBodyText
   - heroCtaText (always "Work With Us")
   - bodyTitle
   - bodyChecklist (3 items)
   - featuresTitle
   - featuresChecklist (9 items)
   - serviceContent (3 blocks, each with kicker, title, and paragraph in Strapi Blocks rich text format)
   - caseStudy (with clientHandle, clientName, heading, ctaText)
   - ctaOverrides (with caption, title, description, buttonText)
   - seo (with metaTitle, metaDescription)

4. Upload the content with a PUT request:
   - Endpoint: PUT {CMS_URL}/api/services/{documentId}
   - Headers: Authorization: Bearer {CMS_API}, Content-Type: application/json
   - Body: { "data": { ...all content fields... } }
   - Do NOT include title, slug, or tags in the body — those already exist.

5. Verify the response contains "data" (not "error"). If it fails, try once more. Report whether the upload succeeded or failed.
```

Replace the placeholders (`{title}`, `{slug}`, `{documentId}`, `{comma-separated tag labels}`) with the actual values from Step 2 for each service.

---

## Step 5: Wait for all sub-agents to complete

You will receive notifications as each background sub-agent finishes. Wait until ALL sub-agents have reported back. Do not proceed to verification until every one has completed.

As each agent finishes, log its result (success or failure + service title).

---

## Step 6: Final verification

Once all sub-agents have completed, make a verification GET request:

```
GET {CMS_URL}/api/services?populate=*&sort=createdAt:asc
```

For each service in the response, check that these fields are non-empty:
- `heroSubtitle`
- `heroBodyText`
- `bodyTitle`
- `featuresTitle`
- `serviceContent` (should be an array of 3 items)
- `featuresChecklist` (should be an array of 9 items)
- `bodyChecklist` (should be an array of 3 items)
- `caseStudy` (should be non-null)
- `ctaOverrides` (should be non-null)
- `seo` (should be non-null)

---

## Step 7: Report results

Present a summary table to the user:

| Service | Status | Notes |
|---|---|---|
| Mobile App Development | Skipped (already has content) | — |
| Web Development | Success / Failed | Any issues |
| ... | ... | ... |

If any services failed, list them clearly so the user can address them manually.
