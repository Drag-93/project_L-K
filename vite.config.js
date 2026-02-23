import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    host:true, //외부 IP에서도 접속 가능
    port: 3000, //개발 서버 포트
    strictPort:true //포트가 이미 사용중이면 실패
  },
});
