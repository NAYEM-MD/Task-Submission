import { config } from "dotenv";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (existsSync(".env")) {
  config({ path: ".env" });
}
if (existsSync(".env.local")) {
  config({ path: ".env.local", override: true });
}

const args = process.argv.slice(2);

// Prefer IPv4 when resolving Neon hostnames (some Windows/network setups fail over IPv6 → P1001).
const env = { ...process.env };
const ipv4Flag = "--dns-result-order=ipv4first";
if (!env.NODE_OPTIONS?.includes("dns-result-order")) {
  env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${ipv4Flag}` : ipv4Flag;
}

const result = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  shell: true,
  env,
});

process.exit(result.status ?? 1);
