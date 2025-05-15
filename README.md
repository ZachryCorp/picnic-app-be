# Express API for Azure Web App Deployment

## Local Development

This project uses SQL Server as the database and connection is made via Prisma, run the following commands to get a local database running

```
docker pull mcr.microsoft.com/mssql/server:latest
```

```
docker run -e "ACCEPT_EULA=1" -e "MSSQL_SA_PASSWORD=reallyStrongPwd123" -e "MSSQL_PID=Developer" -e "MSSQL_USER=SA" -p 1433:1433 -d --name=sql mcr.microsoft.com/mssql/server
```

```
npx prisma migrate dev
npx prisma seed
```
