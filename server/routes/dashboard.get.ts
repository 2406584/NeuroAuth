import { defineEventHandler } from "h3";


export default defineEventHandler(async (event) => {
  return `
      <meta charset="utf-8">
        <h1>Welcome to the Dashboard 🚀 </h1
        <p>This is a protected route. You have successfully accessed the dashboard.</p>
    `;
});