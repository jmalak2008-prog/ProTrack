import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#101b35', blue:'#4263eb', mist:'#f5f7fb' } } }, plugins: [] };
export default config;
