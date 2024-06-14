echo "Executing start.sh script..."
node -v
pnpm install
pnpx prisma generate
pnpm start