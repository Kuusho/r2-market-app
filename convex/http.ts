import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

function checkAuth(request: Request): boolean {
  const secret = process.env.HETZNER_CALLBACK_SECRET || "dev-secret";
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${secret}`;
}

http.route({
  path: "/agent-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!checkAuth(request)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    const existing = await ctx.runQuery(api.agentStatus.get, {
      agentId: body.agentId,
    });
    if (existing) {
      await ctx.runMutation(api.agentStatus.update, {
        id: existing._id,
        status: body.status,
        elizaAgentId: body.elizaAgentId,
        sequentialId: body.sequentialId,
        name: body.name,
      });
    } else {
      await ctx.runMutation(api.agentStatus.set, {
        agentId: body.agentId,
        status: body.status,
        elizaAgentId: body.elizaAgentId,
        sequentialId: body.sequentialId,
        name: body.name,
      });
    }
    return new Response("OK", { status: 200 });
  }),
});

http.route({
  path: "/agents-running",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!checkAuth(request)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const agents = await ctx.runQuery(api.agentStatus.listRunning, {});
    return new Response(JSON.stringify(agents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

http.route({
  path: "/log-trade",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!checkAuth(request)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    await ctx.runMutation(api.trades.log, body);
    return new Response("OK", { status: 200 });
  }),
});

http.route({
  path: "/log-reasoning",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!checkAuth(request)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    await ctx.runMutation(api.reasoning.log, body);
    return new Response("OK", { status: 200 });
  }),
});

export default http;
