export default {
  'src/**/*.{ts,tsx}': [() => 'npm run check-types', 'npm run lint:fix'],
  '**/package.json': ['npx -y sort-package-json'],
  '**/*!(package-lock*).{js,json}': ['prettier --write'],
}
