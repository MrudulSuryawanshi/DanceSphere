# DanceSphere — 15 Practical Syllabus Mapping

| No. | Practical | Evidence in project | How to demonstrate |
|---|---|---|---|
| 1 | HTML headings, lists, images | `client/public/practical-demo.html` | Open the page and show headings, dance-style list and image. |
| 2 | Semantic HTML | `client/public/practical-demo.html`, `client/index.html` | Inspect `header`, `main`, `section`, `footer`, labels and page structure. |
| 3 | Inline, internal, external CSS | `client/public/practical-demo.html` (internal stylesheet), React `className` styling in `client/src/styles.css`; add a one-off inline style in DevTools for the inline-CSS viva example | Show internal and external styles; explain inline styles are applied directly to an element. |
| 4 | Responsive Flexbox, Grid, media queries | `client/src/styles.css` | Resize the browser; inspect grid layouts and media queries. |
| 5 | CSS positioning and properties | `client/src/styles.css` | Show sticky header, sticky filters, absolute hero labels, hover transitions and image overlays. |
| 6 | Link JS, events, array functions | `client/src/App.jsx`, `client/src/data.js`, `client/public/practical-demo.html` | Show click events and `filter`, `map`, `sort`, `find`, `reduce`. |
| 7 | Frontend functionality and validation | Login/register, class form, contact and enquiry pages | Try blank fields, invalid email, mismatched passwords and valid submissions. |
| 8 | React SPA, functional components, JSX | `client/src/main.jsx`, `client/src/App.jsx` | Navigate routes without full page reload. |
| 9 | Props, state, hooks, events, conditional rendering | `client/src/App.jsx` | Show `useState`, `useEffect`, props passed to `ClassCard`, and conditional UI. |
| 10 | Fetch API and JSON | `client/src/api.js`; API endpoints in `server/src/index.js` | Start API and call `/api/classes`; inspect JSON response. |
| 11 | DOM manipulation and event handling | `client/public/practical-demo.html` | Click Change message and use the style filter. |
| 12 | PHP form, validation, strings, sessions | `php-practicals/index.php` | Submit form, start/end session, observe validation and uppercase string output. |
| 13 | PHP-MySQL connectivity and CRUD | `php-practicals/index.php`, `database/schema.sql` | Configure MySQL, create an enquiry using a valid class ID, list and delete it. |
| 14 | Node/Express server, routing, static resources | `server/src/index.js` | Start Express and call `/api/health`; routes are grouped under `/api`. |
| 15 | REST API and database connectivity | `server/src/index.js`, `server/src/db.js`, `database/schema.sql` | Configure MySQL, then test class, auth and enquiry endpoints. |

## Honest implementation note
The main frontend is intentionally usable in demo mode with browser localStorage so the project can be presented without configuring a database. The Express API and PHP module are separate syllabus demonstrations. The frontend's full demo state is not automatically synchronized to the SQL API; the API service is available in `client/src/api.js` for connecting it during a follow-up integration pass.
