# Week 1
- Referencing images in sass: start with `/`, don't reference `img` folder, and place in `public/` that's sibling to `src`
- Icons with `react-icons`
- Form `useFormStatus` and `useFormState` in order to mix returning data with a `redirect`
- Loaded multiple fonts with tailwind. Gotcha - use the `variable` property not `className`!
- In-depth post: Auth with Supabase
  - Need to attach email. Google Workspace may be best to test with; Sendgrid and Resend have usable hobby plans
  - Gracefully handling all errors that can arise in server action using `useFormStatus`
  - Annoying that we dont get error for someone registering with same email. Catch this and display message.
  - Logout using client-side code. Has to be in component since layout can't `use client`