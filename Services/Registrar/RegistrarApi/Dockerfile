FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY . .
WORKDIR /src/Services/Registrar/RegistrarApi
RUN dotnet build RegistrarApi.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish RegistrarApi.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "RegistrarApi.dll"]