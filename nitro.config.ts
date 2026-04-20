import { defineNitroConfig } from "nitropack/config"


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
