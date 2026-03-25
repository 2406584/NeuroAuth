import { defineNitroConfig } from "nitropack/config"

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "server",
  imports: {
      dirs: ["server/utils"],
  },
  externals: {
    inline: []
  },
  moduleSideEffects: ['@prisma/client']
});
