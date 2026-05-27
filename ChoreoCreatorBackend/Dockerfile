FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ChoreoCreatorBackend.sln ./
COPY ChoreoCreator.API/ChoreoCreator.API.csproj ChoreoCreator.API/
COPY ChoreoCreator.Application/ChoreoCreator.Application.csproj ChoreoCreator.Application/
COPY ChoreoCreator.Core/ChoreoCreator.Core.csproj ChoreoCreator.Core/
COPY ChoreoCreator.DataAccess/ChoreoCreator.DataAccess.csproj ChoreoCreator.DataAccess/
COPY ChoreoCreator.Infrastructure/ChoreoCreator.Infrastructure.csproj ChoreoCreator.Infrastructure/

RUN dotnet restore ChoreoCreator.API/ChoreoCreator.API.csproj

COPY . .
RUN dotnet publish ChoreoCreator.API/ChoreoCreator.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ChoreoCreator.API.dll"]
