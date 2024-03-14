import { app } from "$lib/api/app";

export const GET = ({ request }) => app.handle(request);
export const POST = ({ request }) => app.handle(request);
export const PUT = ({ request }) => app.handle(request);
export const DELETE = ({ request }) => app.handle(request);
