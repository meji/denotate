import { AlosaurOpenApiBuilder } from "../../deps.ts";
import { appSettings } from "../settings.ts";

AlosaurOpenApiBuilder.create(appSettings)
  .addTitle("Denotate")
  .addVersion("1.0.0")
  .addDescription("Denotate OpenApi")
  .addServer({
    url: "https://denotate-back.herokuapp.com/",
    description: "Backup Denotare Server"
  })
  .saveToFile("./api.json");
